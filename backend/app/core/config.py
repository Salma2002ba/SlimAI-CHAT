from __future__ import annotations

import json
import os
from functools import lru_cache
from typing import Optional
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
        validation_alias=AliasChoices("DATABASE_URL", "RAILWAY_DATABASE_URL"),
    )
    cors_origins: str = (
        "http://localhost:3000,http://localhost:5173,"
        "http://127.0.0.1:3000,http://127.0.0.1:5173,http://localhost:8080"
    )

    @model_validator(mode="after")
    def resolve_database_url(self) -> Settings:
        direct = (self.database_url or "").strip()
        if not direct:
            direct = (_database_url_from_pg_environ() or "").strip()
        if not direct:
            msg = (
                "DATABASE_URL is not set. On Railway: open your API service → Variables → "
                "New variable → Reference → Postgres → DATABASE_URL. "
                "(Alternatively set PGHOST, PGUSER, PGPASSWORD, PGDATABASE.)"
            )
            raise ValueError(msg)
        self.database_url = direct
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return parse_cors_origins(self.cors_origins)


@lru_cache
def get_settings() -> Settings:
    return Settings()


def normalize_database_url(url: str) -> str:
    if url.startswith("postgresql://") and "+psycopg" not in url:
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url
