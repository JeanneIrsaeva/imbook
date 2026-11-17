from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.author import AuthorShort
from app.schemas.genre import GenreShort


class BookBase(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: str | None = Field(default=None, max_length=5000)
    cover: str | None = None


class BookCreate(BookBase):
    author_ids: list[int] = Field(default_factory=list)
    genre_ids: list[int] = Field(default_factory=list)
    new_authors: list[str] = Field(default_factory=list)
    new_genres: list[str] = Field(default_factory=list)


class BookUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = Field(default=None, max_length=5000)
    cover: str | None = None
    author_ids: list[int] | None = None
    genre_ids: list[int] | None = None


class BookRead(BookBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    owner_id: int | None = None
    created_at: datetime
    authors: list[AuthorShort] = []
    genres: list[GenreShort] = []


class BookShort(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str | None = None
    cover: str | None = None
    owner_id: int | None = None
    authors: list[AuthorShort] = []
    genres: list[GenreShort] = []