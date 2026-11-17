from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.card import ReadingStatus
from app.schemas.book import BookShort
from app.schemas.publisher import PublisherShort


class BookCardCreate(BaseModel):
    book_id: int
    total_pages: int = Field(default=100, ge=1)
    current_page: int = Field(default=0, ge=0)
    status: ReadingStatus = ReadingStatus.PLANNED
    publisher_id: int | None = None
    year: int | None = None
    series: str | None = None
    price: int | None = None
    book_type: str | None = None
    cover: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)


class BookCardPersonalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: str | None = None
    author_ids: list[int] = []
    genre_ids: list[int] = []
    new_authors: list[str] = []
    new_genres: list[str] = []
    total_pages: int = Field(default=100, ge=1)
    current_page: int = Field(default=0, ge=0)
    status: ReadingStatus = ReadingStatus.PLANNED
    publisher_id: int | None = None
    year: int | None = None
    series: str | None = None
    price: int | None = None
    book_type: str | None = None
    cover: str | None = None


class BookCardUpdateProgress(BaseModel):
    current_page: int = Field(ge=0)
    date_started: date | None = None
    date_finished: date | None = None


class BookCardUpdate(BaseModel):
    # Поля карточки
    total_pages: int | None = Field(default=None, ge=1)
    current_page: int | None = Field(default=None, ge=0)
    publisher_id: int | None = None
    year: int | None = None
    series: str | None = None
    price: int | None = None
    book_type: str | None = None
    cover: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)

    # Связи (обновляют книгу)
    author_ids: list[int] | None = None
    genre_ids: list[int] | None = None

    # Поля самой книги (только для личных книг пользователя)
    title: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = Field(default=None, max_length=5000)


class BookCardRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    book_id: int
    status: ReadingStatus
    total_pages: int
    current_page: int
    progress_percent: int
    rating: int | None
    date_started: date | None
    date_finished: date | None
    year: int | None
    series: str | None
    price: int | None
    book_type: str | None
    cover: str | None
    created_at: datetime
    updated_at: datetime
    book: BookShort
    publisher: PublisherShort | None = None