from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.chat import Character, Dialog, Message
from app.models.user import User
from app.schemas.chat import (
    DialogRead,
    DialogStart,
    MessageCreate,
    MessageRead,
    SendMessageResponse,
)
from app.services.chat import ChatService


router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/dialogs", response_model=list[DialogRead])
def list_dialogs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Dialog)
        .options(joinedload(Dialog.character), joinedload(Dialog.messages))
        .filter(Dialog.user_id == current_user.id)
        .order_by(Dialog.started_at.desc())
        .all()
    )


@router.post("/dialogs", response_model=DialogRead, status_code=201)
def start_dialog(
    payload: DialogStart,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    character = db.query(Character).filter(Character.id == payload.character_id).first()
    if not character:
        raise HTTPException(status_code=404, detail="Персонаж не найден")

    existing = (
        db.query(Dialog)
        .filter(
            Dialog.user_id == current_user.id,
            Dialog.character_id == character.id,
        )
        .first()
    )
    if existing:
        return existing

    dialog = Dialog(user_id=current_user.id, character_id=character.id)
    db.add(dialog)
    db.commit()
    db.refresh(dialog)
    return dialog


@router.post("/dialogs/{dialog_id}/messages", response_model=SendMessageResponse)
async def send_message(
    dialog_id: int,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Отправить сообщение персонажу.
    Ответ генерируется LLM в характере персонажа.
    """
    dialog = (
        db.query(Dialog)
        .options(joinedload(Dialog.character).joinedload(Character.book))
        .filter(Dialog.id == dialog_id, Dialog.user_id == current_user.id)
        .first()
    )
    if not dialog:
        raise HTTPException(status_code=404, detail="Диалог не найден")

    user_msg, character_msg = await ChatService.send_message(
        db=db,
        dialog=dialog,
        user_text=payload.text,
    )

    return SendMessageResponse(
        user_message=MessageRead.model_validate(user_msg),
        character_message=MessageRead.model_validate(character_msg),
    )