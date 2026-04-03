import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import chat, health, messages, rag
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import get_engine
from app.services.rag.pipeline import warm_rag_cache

import app.models.message  # noqa: F401 — register ORM models on Base.metadata

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    eng = get_engine()
    if eng is not None:
        Base.metadata.create_all(bind=eng)
    s = get_settings()
    if s.rag_enabled:
        try:
            warm_rag_cache(s)
        except OSError:
            logger.warning("RAG knowledge load failed", exc_info=True)
    yield


settings = get_settings()
app = FastAPI(title="SlimAI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(messages.router, prefix="/api", tags=["messages"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(rag.router, prefix="/api/rag", tags=["rag"])
