from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.author import AuthorShort
from app.schemas.genre import GenreShort


class BookBase(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: str | None = Field(default=None, max_length=5000)


class BookCreate(BookBase):
    """Создание книги в каталоге — с ID авторов и жанров."""
    author_ids: list[int] = Field(default_factory=list)
    genre_ids: list[int] = Field(default_factory=list)


class BookUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = Field(default=None, max_length=5000)
    author_ids: list[int] | None = None
    genre_ids: list[int] | None = None


class BookRead(BookBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    authors: list[AuthorShort] = []
    genres: list[GenreShort] = []


class BookShort(BaseModel):
    """Короткая версия — для вложений в Card."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    authors: list[AuthorShort] = []