from fastapi.testclient import TestClient

from app.main import app


def test_rag_stats_lists_corpus() -> None:
    with TestClient(app) as client:
        r = client.get("/api/rag/stats")
    assert r.status_code == 200
    data = r.json()
    assert data["rag_enabled"] is True
    assert data["chunk_count"] > 0
    assert "01-product.md" in data["sources"]


def test_rag_search_finds_postgres_content() -> None:
    with TestClient(app) as client:
        r = client.get("/api/rag/search", params={"q": "PostgreSQL", "limit": 3})
    assert r.status_code == 200
    data = r.json()
    assert data["total_chunks"] > 0
    assert len(data["results"]) >= 1
    joined = " ".join(x["text_preview"] for x in data["results"])
    assert "postgre" in joined.lower()


def test_chat_rag_provider_returns_markdown(monkeypatch) -> None:
    from app.core import config as config_module

    monkeypatch.setenv("CHAT_PROVIDER", "rag")
    config_module.get_settings.cache_clear()
    try:
        with TestClient(app) as client:
            r = client.post(
                "/api/chat",
                json={
                    "language": "fr",
                    "messages": [{"role": "user", "text": "Qu'est-ce que le RAG ?"}],
                },
            )
        assert r.status_code == 200
        text = r.json()["text"]
        assert "RAG" in text or "retrieval" in text.lower()
    finally:
        monkeypatch.delenv("CHAT_PROVIDER", raising=False)
        config_module.get_settings.cache_clear()
