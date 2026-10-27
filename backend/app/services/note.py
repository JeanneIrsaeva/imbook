from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.card import BookCard, Note


class NoteService:

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
    def get_all(db: Session, card_id: int, user_id: int) -> list[Note]:
        NoteService._get_card(db, card_id, user_id)
        return (
            db.query(Note)
            .filter(Note.card_id == card_id)
            .order_by(Note.created_at.desc())
            .all()
        )

    @staticmethod
    def create(db: Session, card_id: int, user_id: int, text: str) -> Note:
        NoteService._get_card(db, card_id, user_id)
        note = Note(card_id=card_id, text=text)
        db.add(note)
        db.commit()
        db.refresh(note)
        return note

    @staticmethod
    def update(db: Session, note_id: int, user_id: int, text: str) -> Note:
        note = (
            db.query(Note)
            .join(BookCard, Note.card_id == BookCard.id)
            .filter(Note.id == note_id, BookCard.user_id == user_id)
            .first()
        )
        if not note:
            raise HTTPException(status_code=404, detail="Заметка не найдена")
        note.text = text
        db.commit()
        db.refresh(note)
        return note

    @staticmethod
    def delete(db: Session, note_id: int, user_id: int) -> None:
        note = (
            db.query(Note)
            .join(BookCard, Note.card_id == BookCard.id)
            .filter(Note.id == note_id, BookCard.user_id == user_id)
            .first()
        )
        if not note:
            raise HTTPException(status_code=404, detail="Заметка не найдена")
        db.delete(note)
        db.commit()