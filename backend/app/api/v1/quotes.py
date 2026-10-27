from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.quote import QuoteCreate, QuoteRead, QuoteUpdate
from app.services.quote import QuoteService


router = APIRouter(
    prefix="/api/cards/{card_id}/quotes",
    tags=["quotes"],
)


@router.get("", response_model=list[QuoteRead])
def list_quotes(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return QuoteService.get_all(db, card_id, current_user.id)


@router.post("", response_model=QuoteRead, status_code=status.HTTP_201_CREATED)
def create_quote(
    card_id: int,
    payload: QuoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return QuoteService.create(
        db, card_id, current_user.id, payload.text, payload.page_number
    )


@router.patch("/{quote_id}", response_model=QuoteRead)
def update_quote(
    card_id: int,
    quote_id: int,
    payload: QuoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return QuoteService.update(
        db, quote_id, current_user.id, payload.text, payload.page_number
    )


@router.delete("/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(
    card_id: int,
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    QuoteService.delete(db, quote_id, current_user.id)