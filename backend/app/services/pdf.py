import io
from datetime import datetime, date
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)
from reportlab.lib import colors
from sqlalchemy.orm import Session

from app.models.book import Book
from app.models.card import BookCard, ReadingStatus


# Шрифт с кириллицей — ищем DejaVuSans
FONT_CANDIDATES = [
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/DejaVuSans.ttf",                # Windows fallback
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", # Linux
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",  # macOS
]

def _register_font() -> str:
    """Пытается зарегистрировать TTF с кириллицей. Возвращает имя шрифта."""
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            pdfmetrics.registerFont(TTFont("DejaVu", path))
            return "DejaVu"
    return "Helvetica"  # fallback — но кириллица не отобразится


PDF_FONT = _register_font()


class PdfService:

    @staticmethod
    def book_card_pdf(db: Session, card_id: int, user_id: int) -> bytes:
        """PDF с карточкой книги."""
        card = (
            db.query(BookCard)
            .filter(BookCard.id == card_id, BookCard.user_id == user_id)
            .first()
        )
        if not card:
            raise ValueError("Карточка не найдена")

        book = db.query(Book).filter(Book.id == card.book_id).first()

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "Title", parent=styles["Heading1"],
            fontName=PDF_FONT, fontSize=20, spaceAfter=20, alignment=1,
        )
        label_style = ParagraphStyle(
            "Label", parent=styles["Normal"],
            fontName=PDF_FONT, fontSize=12, leading=18,
        )

        story = [
            Paragraph("Карточка книги", title_style),
            Spacer(1, 0.5 * cm),
        ]

        # Таблица «label — value»
        data = [
            ["Название:", book.title],
            ["Автор(ы):", ", ".join(f"{a.last_name} {a.first_name}" for a in book.authors)],
            ["Жанр(ы):", ", ".join(g.name for g in book.genres)],
            ["Год издания:", str(card.year or "—")],
            ["Издательство:", card.publisher.name if card.publisher else "—"],
            ["Всего страниц:", str(card.total_pages)],
            ["Прочитано:", f"{card.current_page} ({card.progress_percent}%)"],
            ["Статус:", card.status.value],
            ["Оценка:", f"{card.rating}/5" if card.rating else "—"],
            ["Дата начала:", str(card.date_started or "—")],
            ["Дата окончания:", str(card.date_finished or "—")],
        ]

        table = Table(
            [[Paragraph(f"<b>{k}</b>", label_style), Paragraph(str(v), label_style)] for k, v in data],
            colWidths=[4 * cm, 12 * cm],
        )
        table.setStyle(TableStyle([
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EDEBE4")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(table)

        if book.description:
            story.append(Spacer(1, 1 * cm))
            story.append(Paragraph("<b>Описание:</b>", label_style))
            story.append(Paragraph(book.description, label_style))

        story.append(Spacer(1, 1 * cm))
        story.append(Paragraph(
            f"<i>Отчёт сгенерирован: {datetime.now().strftime('%d.%m.%Y %H:%M')}</i>",
            label_style,
        ))

        doc.build(story)
        return buffer.getvalue()

    @staticmethod
    def collection_report_pdf(
        db: Session,
        user_id: int,
        date_from: date,
        date_to: date,
    ) -> bytes:
        """PDF с отчётом о пополнении коллекции за период."""
        cards = (
            db.query(BookCard)
            .filter(
                BookCard.user_id == user_id,
                BookCard.created_at >= datetime.combine(date_from, datetime.min.time()),
                BookCard.created_at <= datetime.combine(date_to, datetime.max.time()),
            )
            .all()
        )

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "Title", parent=styles["Heading1"],
            fontName=PDF_FONT, fontSize=18, spaceAfter=20, alignment=1,
        )
        normal = ParagraphStyle("N", parent=styles["Normal"], fontName=PDF_FONT, fontSize=11)

        story = [
            Paragraph("Отчёт по пополнению книжной коллекции", title_style),
            Paragraph(
                f"Период: с {date_from.strftime('%d.%m.%Y')} по {date_to.strftime('%d.%m.%Y')}",
                normal,
            ),
            Spacer(1, 0.5 * cm),
        ]

        # Таблица книг
        header = ["№", "Название", "Автор", "Год", "Жанр", "Дата"]
        rows = [header]
        for i, card in enumerate(cards, 1):
            book = db.query(Book).filter(Book.id == card.book_id).first()
            rows.append([
                str(i),
                book.title,
                ", ".join(f"{a.last_name} {a.first_name}" for a in book.authors) or "—",
                str(card.year or "—"),
                ", ".join(g.name for g in book.genres) or "—",
                card.created_at.strftime("%d.%m.%Y"),
            ])

        table = Table(rows, colWidths=[1 * cm, 5 * cm, 4 * cm, 1.5 * cm, 3 * cm, 2.5 * cm])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#9A884C")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONTNAME", (0, 0), (-1, -1), PDF_FONT),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))
        story.append(table)

        story.append(Spacer(1, 0.5 * cm))
        story.append(Paragraph(f"<b>Всего добавлено книг: {len(cards)}</b>", normal))
        story.append(Spacer(1, 1 * cm))
        story.append(Paragraph(
            f"<i>Отчёт сгенерирован: {datetime.now().strftime('%d.%m.%Y %H:%M')}</i>",
            normal,
        ))

        doc.build(story)
        return buffer.getvalue()