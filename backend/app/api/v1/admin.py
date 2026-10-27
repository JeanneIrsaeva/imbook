from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.core.database import get_db
from app.models.user import User
from app.schemas.admin import UserAdminRead, UserAdminUpdate


router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=list[UserAdminRead])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Список всех пользователей. Только для админа."""
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}", response_model=UserAdminRead)
def update_user(
    user_id: int,
    payload: UserAdminUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Изменить пользователя (роль, имя)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if user.id == admin.id and payload.is_admin is False:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail="Нельзя снять права администратора с себя",
        )

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    from fastapi import HTTPException

    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Нельзя удалить себя")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    db.delete(user)
    db.commit()