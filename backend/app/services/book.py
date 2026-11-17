from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from app.models.book import Author, Book, Genre
from app.models.card import BookCard
from app.schemas.book import BookCreate, BookUpdate


class BookService:
    @staticmethod
    def get_all(db: Session, user_id: int, search: str | None = None, skip: int = 0, limit: int = 50, only_global: bool = False) -> list[Book]:
        query = db.query(Book)
        if only_global:
            query = query.filter(Book.owner_id == None)
        else:
            query = query.filter(or_(Book.owner_id == None, Book.owner_id == user_id))
        if search:
            query = query.filter(Book.title.ilike(f"%{search}%"))
        return query.order_by(Book.title).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, book_id: int) -> Book:
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Книга не найдена")
        return book

    @staticmethod
    def get_user_books_by_author(db: Session, user_id: int, author_id: int) -> list[Book]:
        return (
            db.query(Book).join(Book.cards).join(Book.authors)
            .filter(BookCard.user_id == user_id, Author.id == author_id)
            .distinct().all()
        )

    @staticmethod
    def get_catalog_books_by_author(db: Session, author_id: int) -> list[Book]:
        return (
            db.query(Book).join(Book.authors)
            .filter(Author.id == author_id, Book.owner_id == None)
            .distinct().all()
        )

    @staticmethod
    def get_user_books_by_publisher(db: Session, user_id: int, publisher_id: int) -> list[Book]:
        return (
            db.query(Book).join(Book.cards)
            .filter(BookCard.user_id == user_id, BookCard.publisher_id == publisher_id)
            .distinct().all()
        )

    @staticmethod
    def create(db: Session, payload: BookCreate, owner_id: int | None = None) -> Book:
        authors = []
        if payload.author_ids:
            authors = db.query(Author).filter(Author.id.in_(payload.author_ids)).all()
        if payload.new_authors:
            for name in payload.new_authors:
                parts = name.strip().split(" ", 1)
                last = parts[0]
                first = parts[1] if len(parts) > 1 else ""
                new_author = Author(last_name=last, first_name=first, owner_id=owner_id)
                db.add(new_author)
                authors.append(new_author)

        genres = []
        if payload.genre_ids:
            genres = db.query(Genre).filter(Genre.id.in_(payload.genre_ids)).all()
        if payload.new_genres:
            for g_name in payload.new_genres:
                new_genre = Genre(name=g_name.strip(), owner_id=owner_id)
                db.add(new_genre)
                genres.append(new_genre)

        book = Book(
            title=payload.title,
            description=payload.description,
            cover=payload.cover,  # <-- новое
            authors=authors,
            genres=genres,
            owner_id=owner_id,
        )
        db.add(book)
        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def update(db: Session, book_id: int, payload: BookUpdate) -> Book:
        book = BookService.get_by_id(db, book_id)
        data = payload.model_dump(exclude_unset=True)
        if "author_ids" in data:
            book.authors = db.query(Author).filter(Author.id.in_(data["author_ids"])).all()
        if "genre_ids" in data:
            book.genres = db.query(Genre).filter(Genre.id.in_(data["genre_ids"])).all()
        for field, value in data.items():
            if field not in ("author_ids", "genre_ids"):
                setattr(book, field, value)
        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def delete(db: Session, book_id: int) -> None:
        book = BookService.get_by_id(db, book_id)
        if book.cards:
            raise HTTPException(status_code=409, detail="Нельзя удалить книгу — она есть в библиотеках пользователей")
        db.delete(book)
        db.commit()