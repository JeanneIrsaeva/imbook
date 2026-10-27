from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.book import Book, Genre
from app.models.card import BookCard, ReadingStatus


MONTHS_RU = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
             "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]

# Палитра для графиков (из твоего дизайна)
PALETTE = ["#38130A", "#75391D", "#A26745", "#CFBDA7", "#9A884C", "#E5E3DA"]


class AnalyticsService:

    @staticmethod
    def get_dashboard(db: Session, user_id: int, year: int | None = None) -> dict:
        if year is None:
            year = date.today().year

        # === Карточки статистики ===
        cards = db.query(BookCard).filter(BookCard.user_id == user_id).all()

        total_books = len(cards)
        read_books = sum(1 for c in cards if c.status == ReadingStatus.FINISHED)
        reading_books = sum(1 for c in cards if c.status == ReadingStatus.READING)
        planned_books = sum(1 for c in cards if c.status == ReadingStatus.PLANNED)
        total_pages_read = sum(c.current_page for c in cards)
        library_value = sum(c.price or 0 for c in cards)

        stats = {
            "total_books": total_books,
            "read_books": read_books,
            "reading_books": reading_books,
            "planned_books": planned_books,
            "total_pages_read": total_pages_read,
            "library_value": library_value,
        }

        # === Распределение по статусам ===
        by_status = [
            {
                "label": "Читаю",
                "value": reading_books,
                "percent": round(reading_books / total_books * 100, 1) if total_books else 0,
                "color": "#75391D",
            },
            {
                "label": "Планирую",
                "value": planned_books,
                "percent": round(planned_books / total_books * 100, 1) if total_books else 0,
                "color": "#A26745",
            },
            {
                "label": "Прочитано",
                "value": read_books,
                "percent": round(read_books / total_books * 100, 1) if total_books else 0,
                "color": "#CFBDA7",
            },
        ]

        # === Распределение по жанрам ===
        genre_query = (
            db.query(Genre.name, func.count(BookCard.id).label("cnt"))
            .join(Book.genres)
            .join(BookCard, BookCard.book_id == Book.id)
            .filter(BookCard.user_id == user_id)
            .group_by(Genre.name)
            .order_by(func.count(BookCard.id).desc())
            .limit(6)
            .all()
        )

        by_genre = []
        for i, (name, cnt) in enumerate(genre_query):
            by_genre.append({
                "label": name,
                "value": cnt,
                "percent": round(cnt / total_books * 100, 1) if total_books else 0,
                "color": PALETTE[i % len(PALETTE)],
            })

        # === Прочитанные книги по месяцам ===
        books_by_month = [{"month": m, "value": 0} for m in MONTHS_RU]
        finished_query = (
            db.query(
                func.extract("month", BookCard.date_finished).label("m"),
                func.count(BookCard.id),
            )
            .filter(
                BookCard.user_id == user_id,
                BookCard.status == ReadingStatus.FINISHED,
                func.extract("year", BookCard.date_finished) == year,
            )
            .group_by("m")
            .all()
        )
        for month_num, cnt in finished_query:
            idx = int(month_num) - 1
            books_by_month[idx]["value"] = cnt

        # === Потрачено денег по месяцам ===
        spending_by_month = [{"month": m, "value": 0} for m in MONTHS_RU]
        spending_query = (
            db.query(
                func.extract("month", BookCard.created_at).label("m"),
                func.sum(BookCard.price),
            )
            .filter(
                BookCard.user_id == user_id,
                func.extract("year", BookCard.created_at) == year,
            )
            .group_by("m")
            .all()
        )
        for month_num, total in spending_query:
            if total:
                idx = int(month_num) - 1
                spending_by_month[idx]["value"] = int(total)

        return {
            "stats": stats,
            "by_status": by_status,
            "by_genre": by_genre,
            "books_by_month": books_by_month,
            "spending_by_month": spending_by_month,
        }