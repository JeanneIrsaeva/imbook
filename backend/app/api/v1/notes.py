from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.note import NoteCreate, NoteRead, NoteUpdate
from app.services.note import NoteService


router = APIRouter(
    prefix="/api/cards/{card_id}/notes",
    tags=["notes"],
)


@router.get("", response_model=list[NoteRead])
def list_notes(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return NoteService.get_all(db, card_id, current_user.id)


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(
    card_id: int,
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return NoteService.create(db, card_id, current_user.id, payload.text)


@router.patch("/{note_id}", response_model=NoteRead)
def update_note(
    card_id: int,
    note_id: int,
    payload: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return NoteService.update(db, note_id, current_user.id, payload.text)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    card_id: int,
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    NoteService.delete(db, note_id, current_user.id)