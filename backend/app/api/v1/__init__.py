from fastapi import APIRouter

from app.api.v1 import (
    admin, analytics, auth, authors, books, cards,
    characters, chat, genres, notes, publishers, quotes, reports, uploads,
)

router = APIRouter()
router.include_router(auth.router)
router.include_router(authors.router)
router.include_router(genres.router)
router.include_router(publishers.router)
router.include_router(books.router)
router.include_router(cards.router)
router.include_router(notes.router)
router.include_router(quotes.router)
router.include_router(analytics.router)
router.include_router(reports.router)
router.include_router(admin.router)
router.include_router(characters.router)
router.include_router(chat.router)
router.include_router(uploads.router) 