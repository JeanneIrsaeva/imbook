from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.genre import GenreCreate, GenreRead, GenreUpdate
from app.services.genre import GenreService

router = APIRouter(prefix="/api/genres", tags=["genres"])

@router.get("", response_model=list[GenreRead])
def list_genres(
    only_global: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GenreService.get_all(db, user_id=current_user.id, only_global=only_global)

@router.post("", response_model=GenreRead, status_code=status.HTTP_201_CREATED)
def create_genre(
    payload: GenreCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    owner_id = None if current_user.is_admin else current_user.id
    return GenreService.create(db, payload, owner_id=owner_id)

@router.patch("/{genre_id}", response_model=GenreRead)
def update_genre(
    genre_id: int,
    payload: GenreUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    return GenreService.update(db, genre_id, payload)

@router.delete("/{genre_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_genre(
    genre_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    GenreService.delete(db, genre_id)