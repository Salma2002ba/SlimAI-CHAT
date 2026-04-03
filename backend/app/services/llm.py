"""Chat completion providers: Gemini (HTTP), mock, and RAG-augmented prompts."""

from __future__ import annotations

import logging
import re
from typing import Literal

import httpx
from fastapi import HTTPException

from app.core.config import Settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag.pipeline import get_rag_context_for_query

logger = logging.getLogger(__name__)

_GEMINI_TIMEOUT = httpx.Timeout(60.0, connect=10.0)
_MODEL_ID_RE = re.compile(r"^[\w.-]+$")


def build_mock_reply(
    payload: ChatRequest,
    settings: Settings,
    *,
    quota_fallback: bool = False,
) -> str:
    last = payload.messages[-1].text.strip()
    preview = last[:800] + ("…" if len(last) > 800 else "")

    rag_block = ""
    if settings.rag_enabled:
        ctx, hits = get_rag_context_for_query(last, settings)
        if hits:
            if payload.language == "fr":
                rag_block = (
                    "\n\n#### RAG — extraits retrouvés (retrieval BM25)\n\n"
                    + ctx
                    + "\n\n_Le mode mock ne synthétise pas avec un LLM ; passe en `gemini` pour une réponse générée._\n"
                )
            else:
                rag_block = (
                    "\n\n#### RAG — retrieved excerpts (BM25 lexical)\n\n"
                    + ctx
                    + "\n\n_Mock mode does not call an LLM; switch to `gemini` for a generated answer._\n"
                )

    if payload.language == "fr":
        if quota_fallback:
            core = (
                "**Quota Gemini temporairement dépassé** — réponse de démonstration.\n\n"
                f"Tu as écrit :\n\n> {preview}\n\n"
                "Avec un quota disponible, SlimAI générerait une réponse complète via Gemini. "
                "Tu peux aussi fixer `CHAT_PROVIDER=mock` sur le serveur pour une démo stable."
            )
        else:
            core = (
                "**Mode démo** (aucun appel LLM réel).\n\n"
                f"Ton message :\n\n> {preview}\n\n"
                "Configure `CHAT_PROVIDER=gemini` et `GEMINI_API_KEY` pour activer le vrai modèle."
            )
        return core + rag_block
    if quota_fallback:
        core = (
            "**Gemini quota temporarily exceeded** — demo response.\n\n"
            f"You wrote:\n\n> {preview}\n\n"
            "With quota available, SlimAI would answer via Gemini. "
            "Set `CHAT_PROVIDER=mock` on the server for a stable demo."
        )
    else:
        core = (
            "**Demo mode** (no real LLM call).\n\n"
            f"Your message:\n\n> {preview}\n\n"
            "Set `CHAT_PROVIDER=gemini` and `GEMINI_API_KEY` to enable the live model."
        )
    return core + rag_block


def _gemini_generate_content(api_key: str, model: str, body: dict) -> dict:
    if not _MODEL_ID_RE.match(model):
        raise HTTPException(status_code=400, detail="invalid_gemini_model")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    with httpx.Client(timeout=_GEMINI_TIMEOUT) as client:
        r = client.post(url, params={"key": api_key}, json=body)
    try:
        data = r.json()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail="gemini_invalid_response") from exc
    if r.status_code != 200:
        err_msg = ""
        if isinstance(data, dict) and "error" in data:
            err_msg = str(data.get("error", {}).get("message", ""))[:300]
        logger.warning("Gemini HTTP %s: %s", r.status_code, err_msg or r.text[:300])
        if r.status_code == 429:
            raise HTTPException(status_code=429, detail="gemini_rate_limited")
        raise HTTPException(status_code=502, detail="gemini_upstream_error")
    return data


def _reply_text_from_gemini_payload(data: dict, language: Literal["fr", "en"]) -> str:
    candidates = data.get("candidates") or []
    text = ""
    if candidates:
        try:
            parts = candidates[0].get("content", {}).get("parts") or []
            text = (parts[0].get("text") or "").strip()
        except (IndexError, KeyError, TypeError):
            text = ""

    if not text:
        block = data.get("promptFeedback", {}).get("blockReason")
        if block:
            return (
                "La requête a été bloquée par les filtres de sécurité du modèle. Reformulez votre message."
                if language == "fr"
                else "The request was blocked by the model's safety filters. Try rephrasing."
            )
        return (
            "Désolé, je n'ai pas pu générer de réponse."
            if language == "fr"
            else "I'm sorry, I couldn't generate a response."
        )
    return text


def run_gemini_chat(
    *,
    api_key: str,
    model: str,
    payload: ChatRequest,
    settings: Settings,
) -> ChatResponse:
    sys_fr = (
        "Tu es SlimAI, un assistant utile et professionnel. "
        "Réponds en français. Utilise le markdown quand c'est pertinent. "
        "Sois concis."
    )
    sys_en = (
        "You are SlimAI, a helpful professional assistant. "
        "Respond in English. Use markdown when helpful. Be concise."
    )
    system_instruction = sys_fr if payload.language == "fr" else sys_en

    if settings.rag_enabled:
        query = payload.messages[-1].text
        ctx, _hits = get_rag_context_for_query(query, settings)
        if ctx.strip():
            if payload.language == "fr":
                system_instruction += (
                    "\n\n---\n**Contexte documentaire (RAG)** — Appuie-toi sur ces extraits quand c’est pertinent ; "
                    "cite le `chunk_id` entre crochets si tu t’en sers.\n\n"
                    + ctx
                )
            else:
                system_instruction += (
                    "\n\n---\n**Document context (RAG)** — Use these excerpts when relevant; "
                    "cite `chunk_id` in brackets when you rely on them.\n\n"
                    + ctx
                )

    contents = [
        {
            "role": "user" if m.role == "user" else "model",
            "parts": [{"text": m.text}],
        }
        for m in payload.messages
    ]
    body = {
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "contents": contents,
    }

    try:
        data = _gemini_generate_content(api_key, model, body)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail="gemini_upstream_error") from exc

    text = _reply_text_from_gemini_payload(data, payload.language)
    return ChatResponse(text=text)
