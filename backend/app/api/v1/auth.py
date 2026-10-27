from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_token_type,
)
from app.models.user import User
from app.schemas.user import Token, TokenRefresh, UserCreate, UserRead
from app.services.auth import AuthService
from fastapi import HTTPException
from jose import JWTError


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя. Сразу возвращает токены."""
    user = AuthService.register(db, payload)

    return Token(
        access_token=create_access_token(subject=user.id),
        refresh_token=create_refresh_token(subject=user.id),
    )


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = AuthService.authenticate(db, login=form_data.username, password=form_data.password)

    return Token(
        access_token=create_access_token(subject=user.id),
        refresh_token=create_refresh_token(subject=user.id),
    )


@router.post("/refresh", response_model=Token)
def refresh(payload: TokenRefresh):
    try:
        decoded = decode_token(payload.refresh_token)
        if not verify_token_type(decoded, "refresh"):
            raise HTTPException(status_code=401, detail="Неверный тип токена")

        user_id = int(decoded["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Невалидный refresh-токен")

    return Token(
        access_token=create_access_token(subject=user_id),
        refresh_token=payload.refresh_token,     # refresh можно не менять
    )


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user