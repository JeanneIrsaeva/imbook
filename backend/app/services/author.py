from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from app.models.book import Author
from app.schemas.author import AuthorCreate, AuthorUpdate

class AuthorService:
    @staticmethod
    def get_all(db: Session, user_id: int, only_global: bool = False) -> list[Author]:
        query = db.query(Author)
        if only_global:
            query = query.filter(Author.owner_id == None)
        else:
            query = query.filter(or_(Author.owner_id == None, Author.owner_id == user_id))
        return query.order_by(Author.last_name).all()

    @staticmethod
    def get_by_id(db: Session, author_id: int, user_id: int | None = None) -> Author:
        """Возвращает автора, если он глобальный или принадлежит текущему пользователю."""
        author = db.query(Author).filter(Author.id == author_id).first()
        if not author:
            raise HTTPException(status_code=404, detail="Автор не найден")
        if author.owner_id is not None and author.owner_id != user_id:
            raise HTTPException(status_code=404, detail="Автор не найден")
        return author

    @staticmethod
    def create(db: Session, payload: AuthorCreate, owner_id: int | None = None) -> Author:
        author = Author(**payload.model_dump(), owner_id=owner_id)
        db.add(author)
        db.commit()
        db.refresh(author)
        return author

    @staticmethod
    def update(db: Session, author_id: int, payload: AuthorUpdate) -> Author:
        author = db.query(Author).filter(Author.id == author_id).first()
        if not author:
            raise HTTPException(status_code=404, detail="Автор не найден")
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(author, field, value)
        db.commit()
        db.refresh(author)
        return author

    @staticmethod
    def delete(db: Session, author_id: int) -> None:
        author = db.query(Author).filter(Author.id == author_id).first()
        if not author:
            raise HTTPException(status_code=404, detail="Автор не найден")
        if author.books:
            raise HTTPException(status_code=409, detail="Нельзя удалить — у автора есть книги")
        db.delete(author)
        db.commit()