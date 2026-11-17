from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.book import Author, Book, Genre, Publisher
from app.models.card import BookCard, ReadingStatus
from app.schemas.card import BookCardCreate, BookCardUpdate


class CardService:
    @staticmethod
    def _with_relations(query):
        return query.options(
            joinedload(BookCard.book).joinedload(Book.authors),
            joinedload(BookCard.book).joinedload(Book.genres),
            joinedload(BookCard.publisher),
        )

    @staticmethod
    def get_all(db: Session, user_id: int, status_filter: ReadingStatus | None = None) -> list[BookCard]:
        query = CardService._with_relations(db.query(BookCard)).filter(BookCard.user_id == user_id)
        if status_filter:
            query = query.filter(BookCard.status == status_filter)
        return query.order_by(BookCard.created_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, card_id: int, user_id: int) -> BookCard:
        card = (
            CardService._with_relations(db.query(BookCard))
            .populate_existing()
            .filter(BookCard.id == card_id, BookCard.user_id == user_id)
            .first()
        )
        if not card:
            raise HTTPException(status_code=404, detail="Карточка не найдена")
        return card

    @staticmethod
    def create(db: Session, user_id: int, payload: BookCardCreate) -> BookCard:
        book = db.query(Book).filter(Book.id == payload.book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Книга не найдена")

        if payload.publisher_id:
            publisher = db.query(Publisher).filter(Publisher.id == payload.publisher_id).first()
            if not publisher:
                raise HTTPException(status_code=404, detail="Издательство не найдено")

        if payload.current_page > payload.total_pages:
            raise HTTPException(status_code=400, detail="Текущая страница больше общего количества")

        card = BookCard(**payload.model_dump(), user_id=user_id)
        db.add(card)
        db.commit()
        db.refresh(card)
        return CardService.get_by_id(db, card.id, user_id)
    
    @staticmethod
    def update(db: Session, card_id: int, user_id: int, payload: BookCardUpdate) -> BookCard:
        card = CardService.get_by_id(db, card_id, user_id)
        data = payload.model_dump(exclude_unset=True)

        if "total_pages" in data and data["total_pages"] is not None and data["total_pages"] < card.current_page:
            raise HTTPException(
                status_code=400,
                detail=f"Нельзя уменьшить total_pages ниже текущей страницы ({card.current_page})",
            )

        if data.get("publisher_id"):
            publisher = db.query(Publisher).filter(Publisher.id == data["publisher_id"]).first()
            if not publisher:
                raise HTTPException(status_code=404, detail="Издательство не найдено")

        book_fields = {"title", "description", "author_ids", "genre_ids"}
        is_own_book = (card.book.owner_id == user_id)

        # 1. Обновляем поля карточки
        for field, value in data.items():
            if field in book_fields:
                continue
            setattr(card, field, value)

        # 2. Обновляем поля книги, только если это личная книга
        if is_own_book:
            if "title" in data and data["title"] is not None:
                card.book.title = data["title"]
            if "description" in data:
                card.book.description = data["description"]
            if "author_ids" in data and data["author_ids"] is not None:
                authors = db.query(Author).filter(Author.id.in_(data["author_ids"])).all()
                card.book.authors = authors
            if "genre_ids" in data and data["genre_ids"] is not None:
                genres = db.query(Genre).filter(Genre.id.in_(data["genre_ids"])).all()
                card.book.genres = genres

        db.commit()
        db.refresh(card)
        db.refresh(card.book)
        return CardService.get_by_id(db, card_id, user_id)

    @staticmethod
    def delete(db: Session, card_id: int, user_id: int) -> None:
        card = CardService.get_by_id(db, card_id, user_id)
        db.delete(card)
        db.commit()