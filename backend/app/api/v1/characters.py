from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.models.chat import Character
from app.models.user import User
from app.schemas.chat import CharacterCreate, CharacterRead


router = APIRouter(prefix="/api/characters", tags=["characters"])


@router.get("", response_model=list[CharacterRead])
def list_characters(
    book_id: int | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = db.query(Character)
    if book_id:
        query = query.filter(Character.book_id == book_id)
    return query.all()


@router.post("", response_model=CharacterRead, status_code=status.HTTP_201_CREATED)
def create_character(
    payload: CharacterCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    character = Character(**payload.model_dump())
    db.add(character)
    db.commit()
    db.refresh(character)
    return character