from fastapi import APIRouter, HTTPException

from app.core.config import get_settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm import build_mock_reply, run_gemini_chat
from app.services.rag.pipeline import format_rag_only_markdown

router = APIRouter()

_MAX_INPUT_CHARS = 120_000


@router.post("/chat", response_model=ChatResponse)
def chat_completion(payload: ChatRequest) -> ChatResponse:
    settings = get_settings()

    total = sum(len(m.text) for m in payload.messages)
    if total > _MAX_INPUT_CHARS:
        raise HTTPException(status_code=413, detail="request_too_large")

    last = payload.messages[-1]
    if last.role != "user":
        raise HTTPException(status_code=400, detail="last_message_must_be_user")

    provider = settings.resolved_chat_provider

    if provider == "rag":
        return ChatResponse(
            text=format_rag_only_markdown(last.text, payload.language, settings),
        )

    if provider == "mock":
        return ChatResponse(text=build_mock_reply(payload, settings))

    key = (settings.gemini_api_key or "").strip()
    if not key:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not configured (CHAT_PROVIDER=gemini).",
        )

    try:
        return run_gemini_chat(
            api_key=key,
            model=settings.gemini_model,
            payload=payload,
            settings=settings,
        )
    except HTTPException as exc:
        if exc.status_code == 429 and settings.gemini_fallback_mock_on_429:
            return ChatResponse(
                text=build_mock_reply(payload, settings, quota_fallback=True),
            )
        raise
