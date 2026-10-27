from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.card import BookCard, Quote


class QuoteService:

    @staticmethod
    def _get_card(db: Session, card_id: int, user_id: int) -> BookCard:
        card = db.query(BookCard).filter(
            BookCard.id == card_id,
            BookCard.user_id == user_id,
        ).first()
        if not card:
            raise HTTPException(status_code=404, detail="Карточка не найдена")
        return card

    @staticmethod
    def get_all(db: Session, card_id: int, user_id: int) -> list[Quote]:
        QuoteService._get_card(db, card_id, user_id)
        return (
            db.query(Quote)
            .filter(Quote.card_id == card_id)
            .order_by(Quote.created_at.desc())
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        card_id: int,
        user_id: int,
        text: str,
        page_number: int | None = None,
    ) -> Quote:
        QuoteService._get_card(db, card_id, user_id)
        quote = Quote(card_id=card_id, text=text, page_number=page_number)
        db.add(quote)
        db.commit()
        db.refresh(quote)
        return quote

    @staticmethod
    def update(
        db: Session,
        quote_id: int,
        user_id: int,
        text: str | None = None,
        page_number: int | None = None,
    ) -> Quote:
        quote = (
            db.query(Quote)
            .join(BookCard, Quote.card_id == BookCard.id)
            .filter(Quote.id == quote_id, BookCard.user_id == user_id)
            .first()
        )
        if not quote:
            raise HTTPException(status_code=404, detail="Цитата не найдена")
        if text is not None:
            quote.text = text
        if page_number is not None:
            quote.page_number = page_number
        db.commit()
        db.refresh(quote)
        return quote

    @staticmethod
    def delete(db: Session, quote_id: int, user_id: int) -> None:
        quote = (
            db.query(Quote)
            .join(BookCard, Quote.card_id == BookCard.id)
            .filter(Quote.id == quote_id, BookCard.user_id == user_id)
            .first()
        )
        if not quote:
            raise HTTPException(status_code=404, detail="Цитата не найдена")
        db.delete(quote)
        db.commit()