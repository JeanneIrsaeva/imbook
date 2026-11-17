from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.utils.files import save_image

router = APIRouter(prefix="/api/uploads", tags=["uploads"])


@router.post("/cover")
async def upload_cover(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    url = await save_image(file, "covers")
    return {"url": url}


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    url = await save_image(file, "avatars")
    current_user.avatar = url
    db.commit()
    db.refresh(current_user)
    return {"url": url}


@router.post("/author-photo")
async def upload_author_photo(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    url = await save_image(file, "authors")
    return {"url": url}


@router.post("/character-photo")
async def upload_character_photo(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    url = await save_image(file, "characters")
    return {"url": url}


@router.post("/publisher-logo")
async def upload_publisher_logo(file: UploadFile = File(...), _: User = Depends(get_current_user)):
    url = await save_image(file, "publishers")
    return {"url": url}