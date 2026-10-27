from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.book import Author, Book, Genre
from app.schemas.book import BookCreate, BookUpdate


class BookService:

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        skip: int = 0,
        limit: int = 50,
    ) -> list[Book]:
        query = db.query(Book)
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
    def _load_authors(db: Session, ids: list[int]) -> list[Author]:
        if not ids:
            return []
        authors = db.query(Author).filter(Author.id.in_(ids)).all()
        if len(authors) != len(set(ids)):
            found = {a.id for a in authors}
            missing = set(ids) - found
            raise HTTPException(
                status_code=400,
                detail=f"Авторы не найдены: {sorted(missing)}",
            )
        return authors

    @staticmethod
    def _load_genres(db: Session, ids: list[int]) -> list[Genre]:
        if not ids:
            return []
        genres = db.query(Genre).filter(Genre.id.in_(ids)).all()
        if len(genres) != len(set(ids)):
            found = {g.id for g in genres}
            missing = set(ids) - found
            raise HTTPException(
                status_code=400,
                detail=f"Жанры не найдены: {sorted(missing)}",
            )
        return genres

    @staticmethod
    def create(db: Session, payload: BookCreate) -> Book:
        authors = BookService._load_authors(db, payload.author_ids)
        genres = BookService._load_genres(db, payload.genre_ids)

        book = Book(
            title=payload.title,
            description=payload.description,
            authors=authors,
            genres=genres,
        )
        db.add(book)
        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def update(db: Session, book_id: int, payload: BookUpdate) -> Book:
        book = BookService.get_by_id(db, book_id)
        data = payload.model_dump(exclude_unset=True)

        if "title" in data:
            book.title = data["title"]
        if "description" in data:
            book.description = data["description"]
        if "author_ids" in data:
            book.authors = BookService._load_authors(db, data["author_ids"])
        if "genre_ids" in data:
            book.genres = BookService._load_genres(db, data["genre_ids"])

        db.commit()
        db.refresh(book)
        return book

    @staticmethod
    def delete(db: Session, book_id: int) -> None:
        book = BookService.get_by_id(db, book_id)
        # Проверка: если у книги есть карточки у пользователей — не удаляем
        if book.cards:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Нельзя удалить книгу — она есть у {len(book.cards)} пользовател(ей)",
            )
        db.delete(book)
        db.commit()