from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import (
    create_access_token, create_refresh_token, decode_token, verify_token_type,
    hash_password, verify_password,
)
from app.models.user import User
from app.schemas.user import Token, TokenRefresh, UserCreate, UserRead, UserUpdate, PasswordChange
from app.services.auth import AuthService

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
        refresh_token=payload.refresh_token,
    )


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Обновление профиля текущего пользователя (имя, email, аватар)."""
    data = payload.model_dump(exclude_unset=True)

    # Проверка уникальности email, если он меняется
    if "email" in data and data["email"] != current_user.email:
        exists = db.query(User).filter(User.email == data["email"], User.id != current_user.id).first()
        if exists:
            raise HTTPException(status_code=409, detail="Этот email уже используется")

    for field, value in data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Смена пароля текущего пользователя."""
    if not verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный текущий пароль")
    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Удаление текущего пользователя. Все его данные (карточки, диалоги и т.д.) удалятся каскадом."""
    db.delete(current_user)
    db.commit()