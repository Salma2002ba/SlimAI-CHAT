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


@lru_cache
def get_settings() -> Settings:
    return Settings()


def normalize_database_url(url: str) -> str:
    if url.startswith("postgresql://") and "+psycopg" not in url:
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url
