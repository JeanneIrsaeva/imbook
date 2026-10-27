from datetime import date
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.card import BookCard, ReadingStatus


class ProgressService:
    """
    Бизнес-логика трекинга чтения.
    Инкапсулирует правила смены статусов и расчёта прогресса.
    """

    @staticmethod
    def update_progress(
        db: Session,
        card: BookCard,
        new_page: int,
        date_started: date | None = None,
        date_finished: date | None = None,
    ) -> BookCard:
        # Валидация
        if new_page < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Текущая страница не может быть отрицательной",
            )
        if new_page > card.total_pages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Нельзя указать страницу больше {card.total_pages}",
            )

        prev_page = card.current_page
        card.current_page = new_page

        # Автоматическая смена статуса
        if new_page == 0 and card.status == ReadingStatus.PLANNED:
            pass  # остаётся «Планирую»

        elif 0 < new_page < card.total_pages:
            # Начал читать
            if card.status == ReadingStatus.PLANNED:
                card.status = ReadingStatus.READING
                card.date_started = date_started or date.today()
            elif card.date_started is None:
                card.date_started = date_started or date.today()

        elif new_page == card.total_pages:
            # Дочитал до конца
            card.status = ReadingStatus.FINISHED
            if card.date_started is None:
                card.date_started = date_started or date.today()
            card.date_finished = date_finished or date.today()

        # Если откатили назад
        if new_page < prev_page and card.status == ReadingStatus.FINISHED:
            card.status = ReadingStatus.READING
            card.date_finished = None

        db.commit()
        db.refresh(card)
        return card

    @staticmethod
    def change_status(
        db: Session,
        card: BookCard,
        new_status: ReadingStatus,
    ) -> BookCard:
        """Ручная смена статуса — с автоматическим проставлением дат."""
        if new_status == card.status:
            return card

        card.status = new_status

        if new_status == ReadingStatus.READING and card.date_started is None:
            card.date_started = date.today()

        if new_status == ReadingStatus.FINISHED:
            if card.date_started is None:
                card.date_started = date.today()
            card.date_finished = date.today()
            card.current_page = card.total_pages  # прочитано = все страницы

        if new_status == ReadingStatus.PLANNED:
            card.date_started = None
            card.date_finished = None
            card.current_page = 0

        db.commit()
        db.refresh(card)
        return card