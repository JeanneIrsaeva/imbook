from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.core.database import get_db
from app.schemas.publisher import PublisherCreate, PublisherRead, PublisherUpdate
from app.services.publisher import PublisherService


router = APIRouter(prefix="/api/publishers", tags=["publishers"])


@router.get("", response_model=list[PublisherRead])
def list_publishers(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
):
    return PublisherService.get_all(db)


@router.post("", response_model=PublisherRead, status_code=status.HTTP_201_CREATED)
def create_publisher(
    payload: PublisherCreate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return PublisherService.create(db, payload)


@router.patch("/{publisher_id}", response_model=PublisherRead)
def update_publisher(
    publisher_id: int,
    payload: PublisherUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    return PublisherService.update(db, publisher_id, payload)


@router.delete("/{publisher_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_publisher(
    publisher_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    PublisherService.delete(db, publisher_id)