from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.schemas.book import BookCreate, BookRead, BookUpdate
from app.services.book import BookService


router = APIRouter(prefix="/api/books", tags=["books"])


@router.get("", response_model=list[BookRead])
def list_books(
    search: str | None = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
):
    """Список книг каталога с поиском по названию."""
    return BookService.get_all(db, search=search, skip=skip, limit=limit)


@router.get("/{book_id}", response_model=BookRead)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
):
    return BookService.get_by_id(db, book_id)


@router.post("", response_model=BookRead, status_code=status.HTTP_201_CREATED)
def create_book(
    payload: BookCreate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    """Добавить книгу в каталог. Только для админа."""
    return BookService.create(db, payload)


@router.patch("/{book_id}", response_model=BookRead)
def update_book(
    book_id: int,
    payload: BookUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return BookService.update(db, book_id, payload)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    BookService.delete(db, book_id)