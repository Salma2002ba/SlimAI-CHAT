from fastapi.testclient import TestClient

from app.main import app


def test_create_and_list_messages() -> None:
    with TestClient(app) as client:
        post = client.post("/api/messages", json={"content": "  hello  "})
        assert post.status_code == 200
        body = post.json()
        assert body["content"] == "hello"
        assert "id" in body

        listed = client.get("/api/messages")
    assert listed.status_code == 200
    rows = listed.json()
    assert len(rows) >= 1
    assert rows[0]["content"] == "hello"
