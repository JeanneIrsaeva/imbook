from datetime import date, datetime

from sqlalchemy import (
    Date, DateTime, Enum, ForeignKey, Integer, String, Text, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
import enum


class ReadingStatus(str, enum.Enum):
    PLANNED = "planned"      # Планирую
    READING = "reading"      # Читаю
    FINISHED = "finished"    # Прочитано


class BookCard(Base):
    """
    ЭКЗЕМПЛЯР — конкретная книга у конкретного пользователя.
    Здесь хранится вся пользовательская активность.
    """
    __tablename__ = "book_cards"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Привязка к каталогу и пользователю
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    publisher_id: Mapped[int | None] = mapped_column(
        ForeignKey("publishers.id", ondelete="SET NULL"), nullable=True
    )

    # Данные экземпляра
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    series: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cover: Mapped[str | None] = mapped_column(String(500), nullable=True)
    price: Mapped[int | None] = mapped_column(Integer, nullable=True)  # в копейках
    book_type: Mapped[str | None] = mapped_column(String(32), nullable=True)  # physical / electronic

    # Прогресс чтения
    status: Mapped[ReadingStatus] = mapped_column(
        Enum(ReadingStatus, name="reading_status"),
        default=ReadingStatus.PLANNED,
        index=True,
    )
    total_pages: Mapped[int] = mapped_column(Integer, default=0)
    current_page: Mapped[int] = mapped_column(Integer, default=0)

    date_started: Mapped[date | None] = mapped_column(Date, nullable=True)
    date_finished: Mapped[date | None] = mapped_column(Date, nullable=True)

    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 1-5

    # Служебные
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Связи
    book: Mapped["Book"] = relationship(back_populates="cards")
    user: Mapped["User"] = relationship(back_populates="cards")
    publisher: Mapped["Publisher | None"] = relationship(back_populates="cards")

    notes: Mapped[list["Note"]] = relationship(
        back_populates="card", cascade="all, delete-orphan"
    )
    quotes: Mapped[list["Quote"]] = relationship(
        back_populates="card", cascade="all, delete-orphan"
    )

    @property
    def progress_percent(self) -> int:
        """Процент прочтения — вычисляется автоматически."""
        if self.total_pages <= 0:
            return 0
        return min(100, round(self.current_page / self.total_pages * 100))


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    card_id: Mapped[int] = mapped_column(
        ForeignKey("book_cards.id", ondelete="CASCADE"), index=True
    )
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    card: Mapped["BookCard"] = relationship(back_populates="notes")


class Quote(Base):
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(primary_key=True)
    card_id: Mapped[int] = mapped_column(
        ForeignKey("book_cards.id", ondelete="CASCADE"), index=True
    )
    text: Mapped[str] = mapped_column(Text)
    page_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    card: Mapped["BookCard"] = relationship(back_populates="quotes")