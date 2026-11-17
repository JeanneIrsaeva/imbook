from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from app.models.book import Publisher
from app.schemas.publisher import PublisherCreate, PublisherUpdate

class PublisherService:
    @staticmethod
    def get_all(db: Session, user_id: int, only_global: bool = False) -> list[Publisher]:
        query = db.query(Publisher)
        if only_global:
            query = query.filter(Publisher.owner_id == None)
        else:
            query = query.filter(or_(Publisher.owner_id == None, Publisher.owner_id == user_id))
        return query.order_by(Publisher.name).all()

    @staticmethod
    def get_by_id(db: Session, publisher_id: int) -> Publisher:
        publisher = db.query(Publisher).filter(Publisher.id == publisher_id).first()
        if not publisher:
            raise HTTPException(status_code=404, detail="Издательство не найдено")
        return publisher

    @staticmethod
    def create(db: Session, payload: PublisherCreate, owner_id: int | None = None) -> Publisher:
        query = db.query(Publisher).filter(
            Publisher.name == payload.name,
            or_(Publisher.owner_id == None, Publisher.owner_id == owner_id)
        )
        if query.first():
            raise HTTPException(status_code=409, detail="Издательство с таким именем уже существует")
        
        publisher = Publisher(name=payload.name, logo=payload.logo, owner_id=owner_id)
        db.add(publisher)
        db.commit()
        db.refresh(publisher)
        return publisher

    @staticmethod
    def update(db: Session, publisher_id: int, payload: PublisherUpdate) -> Publisher:
        publisher = PublisherService.get_by_id(db, publisher_id)
        data = payload.model_dump(exclude_unset=True)
        for field, value in data.items():
            setattr(publisher, field, value)
        db.commit()
        db.refresh(publisher)
        return publisher

    @staticmethod
    def delete(db: Session, publisher_id: int) -> None:
        publisher = PublisherService.get_by_id(db, publisher_id)
        if publisher.cards:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Нельзя удалить издательство — у него {len(publisher.cards)} карточек",
            )
        db.delete(publisher)
        db.commit()