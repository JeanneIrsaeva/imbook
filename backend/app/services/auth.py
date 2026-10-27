from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


class AuthService:
    """Бизнес-логика регистрации и входа."""

    @staticmethod
    def register(db: Session, payload: UserCreate) -> User:
        """Создать нового пользователя."""

        # Проверка уникальности login
        if db.query(User).filter(User.login == payload.login).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Пользователь с таким логином уже существует",
            )

        # Проверка уникальности email
        if db.query(User).filter(User.email == payload.email).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Этот email уже используется",
            )

        user = User(
            login=payload.login,
            email=payload.email,
            name=payload.name,
            hashed_password=hash_password(payload.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Первый зарегистрировавшийся — админ
        total = db.query(User).count()
        if total == 1:
            user.is_admin = True
            db.commit()
            db.refresh(user)

        return user

    @staticmethod
    def authenticate(db: Session, login: str, password: str) -> User:
        """Проверить логин/пароль. Бросает 401, если не совпало."""
        user = db.query(User).filter(User.login == login).first()

        if not user or not verify_password(password, user.hashed_password):
            # Общее сообщение — не подсказываем, что именно неверно
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверный логин или пароль",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user