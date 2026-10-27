from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.book import Publisher
from app.schemas.publisher import PublisherCreate, PublisherUpdate


class PublisherService:

    @staticmethod
    def get_all(db: Session) -> list[Publisher]:
        return db.query(Publisher).order_by(Publisher.name).all()

    @staticmethod
    def get_by_id(db: Session, publisher_id: int) -> Publisher:
        publisher = db.query(Publisher).filter(Publisher.id == publisher_id).first()
        if not publisher:
            raise HTTPException(status_code=404, detail="Издательство не найдено")
        return publisher

    @staticmethod
    def create(db: Session, payload: PublisherCreate) -> Publisher:
        if db.query(Publisher).filter(Publisher.name == payload.name).first():
            raise HTTPException(status_code=409, detail="Издательство с таким именем уже существует")
        publisher = Publisher(**payload.model_dump())
        db.add(publisher)
        db.commit()
        db.refresh(publisher)
        return publisher

    @staticmethod
    def update(db: Session, publisher_id: int, payload: PublisherUpdate) -> Publisher:
        publisher = PublisherService.get_by_id(db, publisher_id)
        if payload.name != publisher.name:
            if db.query(Publisher).filter(Publisher.name == payload.name).first():
                raise HTTPException(status_code=409, detail="Издательство с таким именем уже существует")
        publisher.name = payload.name
        db.commit()
        db.refresh(publisher)
        return publisher

    @staticmethod
    def delete(db: Session, publisher_id: int) -> None:
        publisher = PublisherService.get_by_id(db, publisher_id)
        if publisher.cards:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Нельзя удалить издательство — у него {len(publisher.cards)} карточ(ек)",
            )
        db.delete(publisher)
        db.commit()