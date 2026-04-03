"""Lexical retrieval (sparse, BM25-like scoring without extra deps)."""

from __future__ import annotations

import math
import re
from collections import Counter

from app.services.rag.types import TextChunk

_TOKEN_RE = re.compile(r"\b\w+\b", re.UNICODE)


def tokenize(text: str) -> list[str]:
    return [t.lower() for t in _TOKEN_RE.findall(text)]


def _document_frequencies(chunks: list[TextChunk]) -> dict[str, int]:
    df: dict[str, int] = {}
    for ch in chunks:
        seen = set(tokenize(ch.text))
        for w in seen:
            df[w] = df.get(w, 0) + 1
    return df


def _bm25_scores(query: str, chunks: list[TextChunk], *, k1: float = 1.2, b: float = 0.75) -> list[tuple[float, TextChunk]]:
    q_terms = tokenize(query)
    if not q_terms:
        return [(0.0, ch) for ch in chunks]

    N = len(chunks)
    avgdl = sum(len(tokenize(c.text)) for c in chunks) / max(N, 1)
    df = _document_frequencies(chunks)

    scored: list[tuple[float, TextChunk]] = []
    for ch in chunks:
        terms = tokenize(ch.text)
        dl = len(terms)
        tf = Counter(terms)
        score = 0.0
        for w in q_terms:
            if w not in tf:
                continue
            n = df.get(w, 0)
            idf = math.log(1 + (N - n + 0.5) / (n + 0.5))
            f = tf[w]
            denom = f + k1 * (1 - b + b * dl / avgdl)
            score += idf * (f * (k1 + 1)) / denom
        scored.append((score, ch))
    scored.sort(key=lambda x: -x[0])
    return scored


def retrieve_top_k(query: str, chunks: list[TextChunk], k: int) -> list[tuple[float, TextChunk]]:
    if not chunks:
        return []
    ranked = _bm25_scores(query, chunks)
    positive = [(s, c) for s, c in ranked if s > 0][:k]
    if positive:
        return positive
    # Cold query: still return a few chunks so the pipeline is demonstrable
    return [(0.0, c) for _, c in ranked[: max(1, min(k, len(ranked)))]]
