from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, messages
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import get_engine

import app.models.message  # noqa: F401 — register ORM models on Base.metadata


@asynccontextmanager
async def lifespan(_app: FastAPI):
    eng = get_engine()
    if eng is not None:
        Base.metadata.create_all(bind=eng)
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
