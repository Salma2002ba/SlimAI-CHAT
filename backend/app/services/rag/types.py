from dataclasses import dataclass


@dataclass(frozen=True)
class TextChunk:
    chunk_id: str
    source: str
    text: str
