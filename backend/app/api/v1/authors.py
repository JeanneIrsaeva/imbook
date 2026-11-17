from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.author import AuthorCreate, AuthorRead, AuthorUpdate
from app.schemas.book import BookRead
from app.services.author import AuthorService
from app.services.book import BookService

router = APIRouter(prefix="/api/authors", tags=["authors"])

@router.get("", response_model=list[AuthorRead])
def list_authors(
    only_global: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AuthorService.get_all(db, user_id=current_user.id, only_global=only_global)

@router.get("/{author_id}", response_model=AuthorRead)
def get_author(
    author_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AuthorService.get_by_id(db, author_id, user_id=current_user.id)

@router.get("/{author_id}/my-books", response_model=list[BookRead])
def get_books_by_author(
    author_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Все глобальные книги из каталога, у которых автор = author_id."""
    return BookService.get_catalog_books_by_author(db, author_id)

@router.post("", response_model=AuthorRead, status_code=status.HTTP_201_CREATED)
def create_author(payload: AuthorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    owner_id = None if current_user.is_admin else current_user.id
    return AuthorService.create(db, payload, owner_id=owner_id)

@router.patch("/{author_id}", response_model=AuthorRead)
def update_author(author_id: int, payload: AuthorUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return AuthorService.update(db, author_id, payload)

@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_author(author_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    AuthorService.delete(db, author_id)