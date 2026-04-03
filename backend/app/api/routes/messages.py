from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageRead

router = APIRouter()


@router.get("/messages", response_model=list[MessageRead])
def list_messages(limit: int = 50, db: Session = Depends(get_db)) -> list[Message]:
    limit = min(max(limit, 1), 200)
    stmt = select(Message).order_by(desc(Message.created_at)).limit(limit)
    return list(db.scalars(stmt).all())


@router.post("/messages", response_model=MessageRead)
def create_message(payload: MessageCreate, db: Session = Depends(get_db)) -> Message:
    row = Message(content=payload.content.strip())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
