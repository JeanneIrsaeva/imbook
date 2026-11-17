from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.book import Author, Book, Genre
from app.models.card import BookCard, ReadingStatus
from app.models.user import User
from app.schemas.card import (
    BookCardCreate, BookCardPersonalCreate, BookCardRead, BookCardUpdate, BookCardUpdateProgress
)
from app.services.card import CardService
from app.services.progress import ProgressService

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("", response_model=list[BookCardRead])
def list_cards(status_filter: ReadingStatus | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return CardService.get_all(db, user_id=current_user.id, status_filter=status_filter)


@router.get("/{card_id}", response_model=BookCardRead)
def get_card(card_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return CardService.get_by_id(db, card_id, current_user.id)


@router.post("/from-catalog/{book_id}", response_model=BookCardRead, status_code=status.HTTP_201_CREATED)
def create_card_from_catalog(
    book_id: int, payload: BookCardCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    existing = db.query(BookCard).filter(BookCard.user_id == current_user.id, BookCard.book_id == book_id).first()
    if existing:
        return CardService.get_by_id(db, existing.id, current_user.id)

    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")

    card = BookCard(
        user_id=current_user.id, book_id=book_id,
        total_pages=payload.total_pages, current_page=payload.current_page,
        status=payload.status, publisher_id=payload.publisher_id,
        year=payload.year, series=payload.series, price=payload.price,
        book_type=payload.book_type, rating=payload.rating,
        cover=payload.cover or book.cover,  # <-- fallback из книги
    )
    db.add(card)
    db.commit()
    return CardService.get_by_id(db, card.id, current_user.id)


@router.post("/personal", response_model=BookCardRead, status_code=status.HTTP_201_CREATED)
def create_personal_card(
    payload: BookCardPersonalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = Book(title=payload.title, description=payload.description, cover=payload.cover, owner_id=current_user.id)
    db.add(book)
    db.flush()

    if payload.author_ids:
        for aid in payload.author_ids:
            author = db.query(Author).filter(Author.id == aid).first()
            if author:
                book.authors.append(author)

    for name in payload.new_authors:
        parts = name.strip().split(" ", 1)
        last = parts[0]
        first = parts[1] if len(parts) > 1 else ""
        new_author = Author(last_name=last, first_name=first, owner_id=current_user.id)
        db.add(new_author)
        db.flush()
        book.authors.append(new_author)

    if payload.genre_ids:
        for gid in payload.genre_ids:
            genre = db.query(Genre).filter(Genre.id == gid).first()
            if genre:
                book.genres.append(genre)

    for g_name in payload.new_genres:
        new_genre = Genre(name=g_name.strip(), owner_id=current_user.id)
        db.add(new_genre)
        db.flush()
        book.genres.append(new_genre)

    card = BookCard(
        user_id=current_user.id, book_id=book.id,
        total_pages=payload.total_pages, current_page=payload.current_page,
        status=payload.status, publisher_id=payload.publisher_id,
        year=payload.year, series=payload.series, price=payload.price,
        book_type=payload.book_type, cover=payload.cover,
    )
    db.add(card)
    db.commit()
    return CardService.get_by_id(db, card.id, current_user.id)


@router.patch("/{card_id}", response_model=BookCardRead)
def update_card(card_id: int, payload: BookCardUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return CardService.update(db, card_id, current_user.id, payload)


@router.patch("/{card_id}/progress", response_model=BookCardRead)
def update_progress(card_id: int, payload: BookCardUpdateProgress, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = CardService.get_by_id(db, card_id, current_user.id)
    ProgressService.update_progress(
        db=db, card=card,
        new_page=payload.current_page,
        date_started=payload.date_started,
        date_finished=payload.date_finished,
    )
    return CardService.get_by_id(db, card_id, current_user.id)


@router.patch("/{card_id}/status", response_model=BookCardRead)
def change_status(card_id: int, new_status: ReadingStatus, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    card = CardService.get_by_id(db, card_id, current_user.id)
    ProgressService.change_status(db=db, card=card, new_status=new_status)
    return CardService.get_by_id(db, card_id, current_user.id)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(card_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    CardService.delete(db, card_id, current_user.id)