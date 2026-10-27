from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.book import Book, Publisher
from app.models.card import BookCard, ReadingStatus
from app.schemas.card import BookCardCreate, BookCardUpdate


class CardService:

    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
        status_filter: ReadingStatus | None = None,
    ) -> list[BookCard]:
        query = (
            db.query(BookCard)
            .options(joinedload(BookCard.book), joinedload(BookCard.publisher))
            .filter(BookCard.user_id == user_id)
        )
        if status_filter:
            query = query.filter(BookCard.status == status_filter)
        return query.order_by(BookCard.created_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, card_id: int, user_id: int) -> BookCard:
        card = (
            db.query(BookCard)
            .options(joinedload(BookCard.book), joinedload(BookCard.publisher))
            .filter(BookCard.id == card_id, BookCard.user_id == user_id)
            .first()
        )
        if not card:
            raise HTTPException(status_code=404, detail="Карточка не найдена")
        return card

    @staticmethod
    def create(db: Session, user_id: int, payload: BookCardCreate) -> BookCard:
        # Проверка книги
        book = db.query(Book).filter(Book.id == payload.book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Книга не найдена")

        # Проверка издательства (если указано)
        if payload.publisher_id:
            publisher = db.query(Publisher).filter(Publisher.id == payload.publisher_id).first()
            if not publisher:
                raise HTTPException(status_code=404, detail="Издательство не найдено")

        # Проверка прогресса
        if payload.current_page > payload.total_pages:
            raise HTTPException(
                status_code=400,
                detail=f"Текущая страница ({payload.current_page}) больше общего количества ({payload.total_pages})",
            )

        card = BookCard(**payload.model_dump(), user_id=user_id)
        db.add(card)
        db.commit()
        db.refresh(card)
        return card

    @staticmethod
    def update(db: Session, card_id: int, user_id: int, payload: BookCardUpdate) -> BookCard:
        card = CardService.get_by_id(db, card_id, user_id)
        data = payload.model_dump(exclude_unset=True)

        # Если меняем total_pages — проверяем, что current_page <= total
        if "total_pages" in data and data["total_pages"] < card.current_page:
            raise HTTPException(
                status_code=400,
                detail=f"Нельзя уменьшить total_pages ({data['total_pages']}) ниже текущей страницы ({card.current_page})",
            )

        # Проверка издательства, если меняем
        if "publisher_id" in data and data["publisher_id"]:
            publisher = db.query(Publisher).filter(Publisher.id == data["publisher_id"]).first()
            if not publisher:
                raise HTTPException(status_code=404, detail="Издательство не найдено")

        for field, value in data.items():
            setattr(card, field, value)

        db.commit()
        db.refresh(card)
        return card

    @staticmethod
    def delete(db: Session, card_id: int, user_id: int) -> None:
        card = CardService.get_by_id(db, card_id, user_id)
        db.delete(card)
        db.commit()