from typing import Literal

from pydantic import BaseModel, Field


class ChatMessageIn(BaseModel):
    role: Literal["user", "model"]
    text: str = Field(..., min_length=1, max_length=16000)


class ChatRequest(BaseModel):
    language: Literal["fr", "en"] = "fr"
    messages: list[ChatMessageIn] = Field(..., min_length=1, max_length=80)


class ChatResponse(BaseModel):
    text: str
