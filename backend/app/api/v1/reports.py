from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.services.pdf import PdfService


router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/book/{card_id}")
def download_book_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Скачать PDF-карточку книги."""
    try:
        pdf_bytes = PdfService.book_card_pdf(db, card_id, current_user.id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Карточка не найдена")

    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="book_{card_id}_{date.today()}.pdf"'
        },
    )


@router.get("/collection")
def download_collection_report(
    date_from: date = Query(...),
    date_to: date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Скачать PDF-отчёт о пополнении коллекции за период."""
    if date_from > date_to:
        raise HTTPException(status_code=400, detail="date_from > date_to")

    pdf_bytes = PdfService.collection_report_pdf(
        db, current_user.id, date_from, date_to
    )
    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="collection_{date_from}_{date_to}.pdf"'
        },
    )