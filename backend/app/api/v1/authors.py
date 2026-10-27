from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.schemas.author import AuthorCreate, AuthorRead, AuthorUpdate
from app.services.author import AuthorService


router = APIRouter(prefix="/api/authors", tags=["authors"])


@router.get("", response_model=list[AuthorRead])
def list_authors(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
):
    """Список всех авторов. Доступен любому авторизованному пользователю."""
    return AuthorService.get_all(db)


@router.get("/{author_id}", response_model=AuthorRead)
def get_author(
    author_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
):
    return AuthorService.get_by_id(db, author_id)


@router.post("", response_model=AuthorRead, status_code=status.HTTP_201_CREATED)
def create_author(
    payload: AuthorCreate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    """Создать автора. Только для админа."""
    return AuthorService.create(db, payload)


@router.patch("/{author_id}", response_model=AuthorRead)
def update_author(
    author_id: int,
    payload: AuthorUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return AuthorService.update(db, author_id, payload)


@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_author(
    author_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    AuthorService.delete(db, author_id)