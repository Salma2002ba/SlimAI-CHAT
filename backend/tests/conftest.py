import os

import pytest

# Must run before any `app` import so `app.db.session` picks up test DB settings.
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")


@pytest.fixture(autouse=True)
def _reset_rag_chunk_cache() -> None:
    yield
    from app.services.rag.pipeline import reset_chunk_cache

    reset_chunk_cache()
