from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.book import Author
from app.schemas.author import AuthorCreate, AuthorUpdate


class AuthorService:

    @staticmethod
    def get_all(db: Session) -> list[Author]:
        return db.query(Author).order_by(Author.last_name, Author.first_name).all()

    @staticmethod
    def get_by_id(db: Session, author_id: int) -> Author:
        author = db.query(Author).filter(Author.id == author_id).first()
        if not author:
            raise HTTPException(status_code=404, detail="Автор не найден")
        return author

    @staticmethod
    def create(db: Session, payload: AuthorCreate) -> Author:
        author = Author(**payload.model_dump())
        db.add(author)
        db.commit()
        db.refresh(author)
        return author

    @staticmethod
    def update(db: Session, author_id: int, payload: AuthorUpdate) -> Author:
        author = AuthorService.get_by_id(db, author_id)
        data = payload.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(author, field, value)
        db.commit()
        db.refresh(author)
        return author

    @staticmethod
    def delete(db: Session, author_id: int) -> None:
        author = AuthorService.get_by_id(db, author_id)
        # Проверка: если у автора есть книги — не удаляем
        if author.books:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Нельзя удалить автора — у него {len(author.books)} книг(а)",
            )
        db.delete(author)
        db.commit()