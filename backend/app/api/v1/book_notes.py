from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.models.card import Note, Quote
from app.models.book import Book
from app.models.user import User
from app.schemas.note import NoteCreate, NoteRead
from app.schemas.quote import QuoteCreate, QuoteRead

router = APIRouter(prefix="/api/books", tags=["book-content"])


# --- Общие (для отображения в карточке книги) ---
@router.get("/{book_id}/notes", response_model=list[NoteRead])
def list_book_notes(
    book_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Глобальные заметки книги (созданы админом)."""
    return (
        db.query(Note)
        .filter(Note.book_id == book_id, Note.owner_id == None)
        .order_by(Note.created_at.desc())
        .all()
    )


@router.get("/{book_id}/quotes", response_model=list[QuoteRead])
def list_book_quotes(
    book_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return (
        db.query(Quote)
        .filter(Quote.book_id == book_id, Quote.owner_id == None)
        .order_by(Quote.created_at.desc())
        .all()
    )


# --- Создание (только админ) ---
@router.post("/{book_id}/notes", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_book_note(
    book_id: int,
    payload: NoteCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")

    note = Note(card_id=None, book_id=book_id, text=payload.text, owner_id=None)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.post("/{book_id}/quotes", response_model=QuoteRead, status_code=status.HTTP_201_CREATED)
def create_book_quote(
    book_id: int,
    payload: QuoteCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")

    quote = Quote(
        card_id=None,
        book_id=book_id,
        text=payload.text,
        page_number=payload.page_number,
        owner_id=None,
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


# --- Удаление (только админ) ---
@router.delete("/{book_id}/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book_note(
    book_id: int,
    note_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    note = db.query(Note).filter(Note.id == note_id, Note.book_id == book_id, Note.owner_id == None).first()
    if not note:
        raise HTTPException(status_code=404, detail="Заметка не найдена")
    db.delete(note)
    db.commit()


@router.delete("/{book_id}/quotes/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book_quote(
    book_id: int,
    quote_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id, Quote.book_id == book_id, Quote.owner_id == None).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Цитата не найдена")
    db.delete(quote)
    db.commit()