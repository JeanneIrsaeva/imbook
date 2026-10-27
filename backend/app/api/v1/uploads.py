from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.utils.files import save_image


router = APIRouter(prefix="/api/uploads", tags=["uploads"])


@router.post("/cover")
async def upload_cover(
    file: UploadFile = File(...),
    _: User = Depends(get_current_user),
):
    """Загрузить обложку книги. Возвращает URL."""
    url = await save_image(file, "covers")
    return {"url": url}


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Загрузить аватар. Обновляет user.avatar и возвращает URL."""
    url = await save_image(file, "avatars")
    current_user.avatar = url
    db.commit()
    db.refresh(current_user)
    return {"url": url}