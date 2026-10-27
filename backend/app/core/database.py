from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# Engine — соединение с PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,       # логировать SQL в dev-режиме
    future=True,
    pool_pre_ping=True,        # проверять соединение перед использованием
)


# Фабрика сессий
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,    # не "протухать" объекты после коммита
)


# Базовый класс для моделей
class Base(DeclarativeBase):
    """Base для всех ORM-моделей."""
    pass


# Зависимость для FastAPI
def get_db() -> Generator[Session, None, None]:
    """
    Открывает сессию на время запроса и закрывает её после.
    Используется через `Depends(get_db)` в роутерах.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()