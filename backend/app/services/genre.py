from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.book import Genre
from app.schemas.genre import GenreCreate, GenreUpdate


class GenreService:

    @staticmethod
    def get_all(db: Session) -> list[Genre]:
        return db.query(Genre).order_by(Genre.name).all()

    @staticmethod
    def get_by_id(db: Session, genre_id: int) -> Genre:
        genre = db.query(Genre).filter(Genre.id == genre_id).first()
        if not genre:
            raise HTTPException(status_code=404, detail="Жанр не найден")
        return genre

    @staticmethod
    def create(db: Session, payload: GenreCreate) -> Genre:
        if db.query(Genre).filter(Genre.name == payload.name).first():
            raise HTTPException(status_code=409, detail="Жанр с таким именем уже существует")
        genre = Genre(**payload.model_dump())
        db.add(genre)
        db.commit()
        db.refresh(genre)
        return genre

    @staticmethod
    def update(db: Session, genre_id: int, payload: GenreUpdate) -> Genre:
        genre = GenreService.get_by_id(db, genre_id)
        if payload.name != genre.name:
            if db.query(Genre).filter(Genre.name == payload.name).first():
                raise HTTPException(status_code=409, detail="Жанр с таким именем уже существует")
        genre.name = payload.name
        db.commit()
        db.refresh(genre)
        return genre

    @staticmethod
    def delete(db: Session, genre_id: int) -> None:
        genre = GenreService.get_by_id(db, genre_id)
        if genre.books:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Нельзя удалить жанр — к нему привязано {len(genre.books)} книг(а)",
            )
        db.delete(genre)
        db.commit()