from fastapi import APIRouter, HTTPException
from sqlalchemy import text

from app.db.session import get_engine

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/db-health")
def db_health() -> dict[str, str]:
    engine = get_engine()
    if engine is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "database_not_configured: set DATABASE_URL from your Postgres service "
                "(Variables → Reference → DATABASE_URL or DATABASE_PRIVATE_URL)."
            ),
        )
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "reachable"}
    except Exception as exc:  # noqa: BLE001 — surface DB errors to operators
        raise HTTPException(status_code=503, detail=f"database_unavailable: {exc}") from exc
