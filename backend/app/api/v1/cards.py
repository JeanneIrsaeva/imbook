from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.card import ReadingStatus
from app.models.user import User
from app.schemas.card import (
    BookCardCreate,
    BookCardRead,
    BookCardUpdate,
    BookCardUpdateProgress,
)
from app.services.card import CardService
from app.services.progress import ProgressService


router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("", response_model=list[BookCardRead])
def list_cards(
    status_filter: ReadingStatus | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Список карточек пользователя с фильтром по статусу."""
    return CardService.get_all(db, user_id=current_user.id, status_filter=status_filter)


@router.get("/{card_id}", response_model=BookCardRead)
def get_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CardService.get_by_id(db, card_id, current_user.id)


@router.post("", response_model=BookCardRead, status_code=status.HTTP_201_CREATED)
def create_card(
    payload: BookCardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Добавить книгу в личную библиотеку."""
    return CardService.create(db, user_id=current_user.id, payload=payload)


@router.patch("/{card_id}", response_model=BookCardRead)
def update_card(
    card_id: int,
    payload: BookCardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Обновить метаданные карточки (страницы, издательство, рейтинг)."""
    return CardService.update(db, card_id, current_user.id, payload)


@router.patch("/{card_id}/progress", response_model=BookCardRead)
def update_progress(
    card_id: int,
    payload: BookCardUpdateProgress,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Обновить прогресс. Автоматически меняет статус."""
    card = CardService.get_by_id(db, card_id, current_user.id)
    return ProgressService.update_progress(
        db=db,
        card=card,
        new_page=payload.current_page,
        date_started=payload.date_started,
        date_finished=payload.date_finished,
    )


@router.patch("/{card_id}/status", response_model=BookCardRead)
def change_status(
    card_id: int,
    new_status: ReadingStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Ручная смена статуса."""
    card = CardService.get_by_id(db, card_id, current_user.id)
    return ProgressService.change_status(db=db, card=card, new_status=new_status)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    CardService.delete(db, card_id, current_user.id)