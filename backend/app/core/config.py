from __future__ import annotations

import json
import os
from functools import lru_cache
from typing import Literal, Optional
from urllib.parse import quote_plus

from pydantic import AliasChoices, Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors_origins(raw: str) -> list[str]:
    """Accept comma-separated origins, optional outer quotes, or a JSON array."""
    s = raw.strip()
    if not s:
        return []
    if s.startswith("["):
        try:
            data = json.loads(s)
        except json.JSONDecodeError:
            data = None
        if isinstance(data, list):
            out: list[str] = []
            for item in data:
                t = str(item).strip().strip('"').strip("'")
                if t:
                    out.append(t)
            return out
    parts: list[str] = []
    for segment in s.split(","):
        t = segment.strip().strip('"').strip("'")
        if t:
            parts.append(t)
    return parts


def _database_url_from_pg_environ() -> Optional[str]:
    host = os.getenv("PGHOST")
    user = os.getenv("PGUSER")
    password = os.getenv("PGPASSWORD")
    database = os.getenv("PGDATABASE")
    port = os.getenv("PGPORT") or "5432"
    if not all((host, user, password, database)):
        return None
    u = quote_plus(user)
    p = quote_plus(password)
    base = f"postgresql://{u}:{p}@{host}:{port}/{database}"
    if os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("RAILWAY_PROJECT_ID"):
        sep = "&" if "?" in base else "?"
        base = f"{base}{sep}sslmode=require"
    return base


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices(
            "DATABASE_URL",
            "RAILWAY_DATABASE_URL",
            "POSTGRES_URL",
            "DATABASE_PRIVATE_URL",
        ),
    )
    cors_origins: str = (
        "http://localhost:3000,http://localhost:5173,"
        "http://127.0.0.1:3000,http://127.0.0.1:5173,http://localhost:8080"
    )
    # Server-side only — never expose in the frontend bundle.
    gemini_api_key: Optional[str] = Field(default=None, validation_alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.0-flash", validation_alias="GEMINI_MODEL")
    # auto = Gemini if GEMINI_API_KEY is set, else mock. rag = retrieval-only (no LLM).
    chat_provider: str = Field(default="auto", validation_alias="CHAT_PROVIDER")
    # If true and Gemini returns 429, respond with a mock message instead of error.
    gemini_fallback_mock_on_429: bool = Field(default=False, validation_alias="GEMINI_FALLBACK_MOCK_ON_429")
    # RAG corpus (Markdown) — chunking + lexical retrieval + optional LLM augmentation
    rag_enabled: bool = Field(default=True, validation_alias="RAG_ENABLED")
    rag_top_k: int = Field(default=4, ge=1, le=20, validation_alias="RAG_TOP_K")
    rag_chunk_size: int = Field(default=700, ge=200, le=4000, validation_alias="RAG_CHUNK_SIZE")
    rag_chunk_overlap: int = Field(default=120, ge=0, le=500, validation_alias="RAG_CHUNK_OVERLAP")
    rag_knowledge_dir: Optional[str] = Field(default=None, validation_alias="RAG_KNOWLEDGE_DIR")

    @model_validator(mode="after")
    def strip_database_url(self) -> Settings:
        if self.database_url is not None:
            s = self.database_url.strip()
            self.database_url = s if s else None
        return self

    @property
    def effective_database_url(self) -> Optional[str]:
        """Resolved Postgres URL, or None if the API should start without a database (e.g. missing Railway reference)."""
        if self.database_url:
            return self.database_url
        return _database_url_from_pg_environ()

    @property
    def cors_origin_list(self) -> list[str]:
        return parse_cors_origins(self.cors_origins)

    @property
    def resolved_chat_provider(self) -> Literal["mock", "gemini", "rag"]:
        raw = (self.chat_provider or "auto").strip().lower()
        if raw == "mock":
            return "mock"
        if raw == "rag":
            return "rag"
        if raw == "gemini":
            return "gemini"
        if raw == "auto":
            return "gemini" if (self.gemini_api_key or "").strip() else "mock"
        return "gemini" if (self.gemini_api_key or "").strip() else "mock"


@lru_cache
def get_settings() -> Settings:
    return Settings()


def normalize_database_url(url: str) -> str:
    if url.startswith("postgresql://") and "+psycopg" not in url:
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url
