from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String, Table, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

book_authors = Table(
    "book_authors", Base.metadata,
    Column("book_id", ForeignKey("books.id", ondelete="CASCADE"), primary_key=True),
    Column("author_id", ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True),
)

book_genres = Table(
    "book_genres", Base.metadata,
    Column("book_id", ForeignKey("books.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True),
)

class Author(Base):
    __tablename__ = "authors"
    id: Mapped[int] = mapped_column(primary_key=True)
    last_name: Mapped[str] = mapped_column(String(128))
    first_name: Mapped[str] = mapped_column(String(128))
    middle_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    photo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    biography: Mapped[str | None] = mapped_column(String(5000), nullable=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    books: Mapped[list["Book"]] = relationship(secondary=book_authors, back_populates="authors")

class Genre(Base):
    __tablename__ = "genres"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(128))
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    books: Mapped[list["Book"]] = relationship(secondary=book_genres, back_populates="genres")

class Publisher(Base):
    __tablename__ = "publishers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    logo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    cards: Mapped[list["BookCard"]] = relationship(back_populates="publisher")

class Book(Base):
    __tablename__ = "books"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(500), index=True)
    description: Mapped[str | None] = mapped_column(String(5000), nullable=True)
    cover: Mapped[str | None] = mapped_column(String(500), nullable=True)  # <-- новое
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    authors: Mapped[list[Author]] = relationship(secondary=book_authors, back_populates="books")
    genres: Mapped[list[Genre]] = relationship(secondary=book_genres, back_populates="books")
    cards: Mapped[list["BookCard"]] = relationship(back_populates="book", cascade="all, delete-orphan")