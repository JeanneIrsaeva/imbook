from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.card import BookCard
from app.schemas.publisher import PublisherCreate, PublisherRead, PublisherUpdate
from app.schemas.card import BookCardRead
from app.services.publisher import PublisherService
from app.services.card import CardService

router = APIRouter(prefix="/api/publishers", tags=["publishers"])


@router.get("", response_model=list[PublisherRead])
def list_publishers(
    only_global: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return PublisherService.get_all(db, user_id=current_user.id, only_global=only_global)


@router.get("/{publisher_id}", response_model=PublisherRead)
def get_publisher(publisher_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return PublisherService.get_by_id(db, publisher_id)


@router.get("/{publisher_id}/my-books", response_model=list[BookCardRead])
def get_my_books_by_publisher(
    publisher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Карточки пользователя, изданные этим издательством."""
    cards = (
        db.query(BookCard)
        .filter(BookCard.user_id == current_user.id, BookCard.publisher_id == publisher_id)
        .all()
    )
    return [CardService.get_by_id(db, c.id, current_user.id) for c in cards]


@router.post("", response_model=PublisherRead, status_code=status.HTTP_201_CREATED)
def create_publisher(
    payload: PublisherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    owner_id = None if current_user.is_admin else current_user.id
    return PublisherService.create(db, payload, owner_id=owner_id)


@router.patch("/{publisher_id}", response_model=PublisherRead)
def update_publisher(
    publisher_id: int,
    payload: PublisherUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return PublisherService.update(db, publisher_id, payload)


@router.delete("/{publisher_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_publisher(publisher_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    PublisherService.delete(db, publisher_id)