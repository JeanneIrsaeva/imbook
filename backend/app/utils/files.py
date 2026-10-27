import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


UPLOAD_ROOT = Path(settings.UPLOAD_DIR)


def ensure_upload_dirs() -> None:
    """Создать папки для загрузок, если их нет."""
    (UPLOAD_ROOT / "covers").mkdir(parents=True, exist_ok=True)
    (UPLOAD_ROOT / "avatars").mkdir(parents=True, exist_ok=True)


ALLOWED_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


async def save_image(
    file: UploadFile,
    category: str,           # "covers" | "avatars"
) -> str:
    """
    Сохраняет изображение и возвращает относительный URL.
    Бросает 400, если файл не проходит валидацию.
    """
    # Проверка content-type
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Недопустимый тип файла: {file.content_type}. "
                   f"Разрешены: {settings.ALLOWED_IMAGE_TYPES}",
        )

    # Читаем содержимое, проверяем размер
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Файл слишком большой: {size_mb:.1f} МБ. "
                   f"Максимум {settings.MAX_UPLOAD_SIZE_MB} МБ",
        )

    # Генерируем уникальное имя
    ext = ALLOWED_EXTENSIONS[file.content_type]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = UPLOAD_ROOT / category / filename

    # Сохраняем
    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    # Возвращаем URL, по которому FastAPI будет отдавать файл
    return f"/uploads/{category}/{filename}"