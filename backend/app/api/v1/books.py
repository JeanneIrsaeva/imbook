from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.book import BookCreate, BookRead, BookUpdate
from app.services.book import BookService

router = APIRouter(prefix="/api/books", tags=["books"])

@router.get("", response_model=list[BookRead])
def list_books(
    search: str | None = None,
    skip: int = 0,
    limit: int = 50,
    only_global: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return BookService.get_all(db, user_id=current_user.id, search=search, skip=skip, limit=limit, only_global=only_global)

@router.get("/{book_id}", response_model=BookRead)
def get_book(book_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return BookService.get_by_id(db, book_id)

@router.post("", response_model=BookRead, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    owner_id = None if current_user.is_admin else current_user.id
    return BookService.create(db, payload, owner_id=owner_id)

@router.patch("/{book_id}", response_model=BookRead)
def update_book(book_id: int, payload: BookUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return BookService.update(db, book_id, payload)

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    BookService.delete(db, book_id)
