from sqlalchemy.orm import Session
from fastapi.concurrency import run_in_threadpool

from app.models.chat import Character, Dialog, Message
from app.services.ai import get_ai_service


class ChatService:

    @staticmethod
    def _build_system_prompt(character: Character, book) -> str:
        if character.system_prompt:
            return character.system_prompt
        return (
            f"Ты — {character.name}, персонаж книги «{book.title}». "
            f"Отвечай в характере, не выходи из роли, на русском языке. "
            f"Максимум 3-4 предложения."
        )

    @staticmethod
    def _build_history(dialog: Dialog, limit: int = 10) -> list[dict]:
        msgs = dialog.messages
        recent = msgs[-limit:] if len(msgs) > limit else msgs
        return [
            {
                "role": "user" if m.sender == "user" else "assistant",
                "content": m.text,
            }
            for m in recent
        ]

    @staticmethod
    async def send_message(
        db: Session,
        dialog: Dialog,
        user_text: str,
    ) -> tuple[Message, Message]:
        # 1. Сохраняем сообщение пользователя
        user_msg = Message(dialog_id=dialog.id, text=user_text, sender="user")
        db.add(user_msg)
        db.commit()
        db.refresh(user_msg)

        # 2. Собираем контекст
        system_prompt = ChatService._build_system_prompt(
            dialog.character, dialog.character.book
        )
        # История без последнего (только что добавленного) сообщения
        history = ChatService._build_history(dialog)[:-1]

        # 3. Запрос в GigaChat (синхронный → через threadpool)
        ai = get_ai_service()
        reply_text = await run_in_threadpool(
            ai.generate_reply,
            system_prompt,
            history,
            user_text,
        )

        # 4. Сохраняем ответ
        character_msg = Message(
            dialog_id=dialog.id,
            text=reply_text,
            sender="character",
        )
        db.add(character_msg)
        db.commit()
        db.refresh(character_msg)

        return user_msg, character_msg