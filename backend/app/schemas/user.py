from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- Входные ----------
class UserCreate(BaseModel):
    """Регистрация нового пользователя."""
    login: str = Field(min_length=3, max_length=64)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    name: str = Field(min_length=1, max_length=128)


class UserLogin(BaseModel):
    """Вход в систему."""
    login: str
    password: str


class UserUpdate(BaseModel):
    """Редактирование профиля — все поля опциональны."""
    name: str | None = Field(default=None, min_length=1, max_length=128)
    email: EmailStr | None = None
    avatar: str | None = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(min_length=8, max_length=72)


# ---------- Выходные ----------
class UserRead(BaseModel):
    """Публичные данные пользователя (без пароля)."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    login: str
    email: EmailStr
    name: str
    avatar: str | None
    is_admin: bool
    created_at: datetime


# ---------- Токены ----------
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str