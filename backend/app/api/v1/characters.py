from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.models.card import BookCard, ReadingStatus
from app.models.chat import Character
from app.models.user import User
from app.schemas.chat import CharacterCreate, CharacterRead


router = APIRouter(prefix="/api/characters", tags=["characters"])


@router.get("", response_model=list[CharacterRead])
def list_characters(
    book_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Character).options(joinedload(Character.book))
    if book_id:
        query = query.filter(Character.book_id == book_id)
    characters = query.all()

    # id книг, которые пользователь дочитал
    finished_book_ids = {
        row[0]
        for row in db.query(BookCard.book_id)
        .filter(
            BookCard.user_id == current_user.id,
            BookCard.status == ReadingStatus.FINISHED,
        )
        .all()
    }

    return [
        CharacterRead(
            id=c.id,
            book_id=c.book_id,
            name=c.name,
            description=c.description,
            photo=c.photo,
            is_available=c.book_id in finished_book_ids,
        )
        for c in characters
    ]


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
    # При создании админом новый персонаж по умолчанию недоступен текущему юзеру (админу),
    # но фронт его не использует для диалогов напрямую, так что ок.
    return CharacterRead(
        id=character.id,
        book_id=character.book_id,
        name=character.name,
        description=character.description,
        photo=character.photo,
        is_available=False,
    )