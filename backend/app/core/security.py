from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


# Контекст для хэширования паролей (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------- Пароли ----------
def hash_password(password: str) -> str:
    """Хэширует пароль."""
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """Проверяет, что пароль соответствует хэшу."""
    return pwd_context.verify(plain, hashed)


# ---------- JWT ----------
def create_access_token(subject: str | int, expires_delta: timedelta | None = None) -> str:
    """
    Создаёт access-токен.
    subject — обычно user.id (или login).
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.now(timezone.utc) + expires_delta
    payload: dict[str, Any] = {
        "sub": str(subject),
        "exp": expire,
        "type": "access",
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str | int) -> str:
    """Создаёт refresh-токен с длинным сроком жизни."""
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(subject),
        "exp": expire,
        "type": "refresh",
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    """
    Расшифровывает и валидирует JWT.
    Бросает JWTError, если токен невалиден или истёк.
    """
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


def verify_token_type(payload: dict[str, Any], expected_type: str) -> bool:
    """Проверяет, что токен нужного типа (access / refresh)."""
    return payload.get("type") == expected_type