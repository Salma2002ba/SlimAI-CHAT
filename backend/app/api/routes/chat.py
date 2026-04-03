import logging
import re

import httpx
from fastapi import APIRouter, HTTPException

from app.core.config import get_settings
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()
logger = logging.getLogger(__name__)

_MAX_INPUT_CHARS = 120_000
_GEMINI_TIMEOUT = httpx.Timeout(60.0, connect=10.0)

# Model id in the path must keep dots literal (e.g. gemini-2.0-flash). quote(..., safe="") encodes "." → %2E and breaks the API.
_MODEL_ID_RE = re.compile(r"^[\w.-]+$")


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
        raise HTTPException(status_code=502, detail="gemini_upstream_error")
    return data


@router.post("/chat", response_model=ChatResponse)
def chat_completion(payload: ChatRequest) -> ChatResponse:
    settings = get_settings()
    key = (settings.gemini_api_key or "").strip()
    if not key:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not configured on the server.",
        )

    total = sum(len(m.text) for m in payload.messages)
    if total > _MAX_INPUT_CHARS:
        raise HTTPException(status_code=413, detail="request_too_large")

    last = payload.messages[-1]
    if last.role != "user":
        raise HTTPException(status_code=400, detail="last_message_must_be_user")

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
        data = _gemini_generate_content(key, settings.gemini_model, body)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail="gemini_upstream_error") from exc

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
            text = (
                "La requête a été bloquée par les filtres de sécurité du modèle. Reformulez votre message."
                if payload.language == "fr"
                else "The request was blocked by the model's safety filters. Try rephrasing."
            )
        else:
            text = (
                "Désolé, je n'ai pas pu générer de réponse."
                if payload.language == "fr"
                else "I'm sorry, I couldn't generate a response."
            )
    return ChatResponse(text=text)
