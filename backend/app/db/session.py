from collections.abc import Generator
from typing import Optional

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings, normalize_database_url

_engine: Optional[Engine] = None
_SessionLocal: Optional[sessionmaker] = None


def get_engine() -> Optional[Engine]:
    """Lazily create the SQLAlchemy engine so the app can boot without DATABASE_URL (Railway misconfig)."""
    global _engine, _SessionLocal
    if _engine is not None:
        return _engine
    url = get_settings().effective_database_url
    if not url:
        return None
    db_url = normalize_database_url(url)
    kwargs: dict = {"pool_pre_ping": True}
    if db_url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
        kwargs["poolclass"] = StaticPool
    _engine = create_engine(db_url, **kwargs)
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine


def get_db() -> Generator[Session, None, None]:
    if get_engine() is None or _SessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Database not configured. On Railway: Variables → add reference to Postgres "
                "DATABASE_URL (or DATABASE_PRIVATE_URL / POSTGRES_URL)."
            ),
        )
    db = _SessionLocal()
    try:
        yield db
    finally:
        db.close()
