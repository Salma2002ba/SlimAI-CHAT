from app.core.config import parse_cors_origins


def test_parse_cors_comma() -> None:
    assert parse_cors_origins("https://a.com, https://b.com ") == [
        "https://a.com",
        "https://b.com",
    ]


def test_parse_cors_quoted_tokens() -> None:
    assert parse_cors_origins('"https://a.com", "https://b.com"') == [
        "https://a.com",
        "https://b.com",
    ]


def test_parse_cors_json_array() -> None:
    assert parse_cors_origins('["https://a.com","https://b.com"]') == [
        "https://a.com",
        "https://b.com",
    ]


def test_parse_cors_empty() -> None:
    assert parse_cors_origins("") == []
    assert parse_cors_origins("  ") == []
