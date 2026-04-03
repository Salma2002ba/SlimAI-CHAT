import json
from functools import lru_cache

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


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str
    cors_origins: str = (
        "http://localhost:3000,http://localhost:5173,"
        "http://127.0.0.1:3000,http://127.0.0.1:5173,http://localhost:8080"
    )

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
