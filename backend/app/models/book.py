from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Table, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


# Ассоциативная таблица N:N между Книгой и Автором
book_authors = Table(
    "book_authors",
    Base.metadata,
    Column("book_id", ForeignKey("books.id", ondelete="CASCADE"), primary_key=True),
    Column("author_id", ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True),
)


# Ассоциативная таблица N:N между Книгой и Жанром
book_genres = Table(
    "book_genres",
    Base.metadata,
    Column("book_id", ForeignKey("books.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True),
)


class Author(Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True)
    last_name: Mapped[str] = mapped_column(String(128))
    first_name: Mapped[str] = mapped_column(String(128))
    middle_name: Mapped[str | None] = mapped_column(String(128), nullable=True)

    books: Mapped[list["Book"]] = relationship(
        secondary=book_authors, back_populates="authors"
    )


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(128), unique=True)

    books: Mapped[list["Book"]] = relationship(
        secondary=book_genres, back_populates="genres"
    )


class Publisher(Base):
    __tablename__ = "publishers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)

    cards: Mapped[list["BookCard"]] = relationship(back_populates="publisher")


class Book(Base):
    """
    КАТАЛОГ — общая информация о книге (одна на всех).
    Не содержит пользовательских данных.
    """
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(500), index=True)
    description: Mapped[str | None] = mapped_column(String(5000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    authors: Mapped[list[Author]] = relationship(
        secondary=book_authors, back_populates="books"
    )
    genres: Mapped[list[Genre]] = relationship(
        secondary=book_genres, back_populates="books"
    )

    cards: Mapped[list["BookCard"]] = relationship(
        back_populates="book", cascade="all, delete-orphan"
    )