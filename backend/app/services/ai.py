import os
from pathlib import Path

_ca_path = Path("app/assets/russian_trusted_root_ca.cer")
if _ca_path.exists():
    os.environ["SSL_CERT_FILE"] = str(_ca_path.resolve())

from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
from fastapi import HTTPException, status

from app.core.config import settings


class AIService:

    def __init__(self):
        if not settings.GIGACHAT_CREDENTIALS:
            raise RuntimeError("GIGACHAT_CREDENTIALS не задан в .env")

        self.client = GigaChat(
            credentials=settings.GIGACHAT_CREDENTIALS,
            scope=settings.GIGACHAT_SCOPE,
            model=settings.GIGACHAT_MODEL,     # ← "GigaChat-2"
            verify_ssl_certs=True,
            timeout=60,
        )

    def generate_reply(
        self,
        system_prompt: str,
        history: list[dict],
        user_message: str,
    ) -> str:
        messages = [
            Messages(role=MessagesRole.SYSTEM, content=system_prompt),
        ]
        for h in history:
            role = MessagesRole.ASSISTANT if h["role"] == "assistant" else MessagesRole.USER
            messages.append(Messages(role=role, content=h["content"]))
        messages.append(Messages(role=MessagesRole.USER, content=user_message))

        try:
            chat = Chat(                          # ← без model=
                messages=messages,
                temperature=settings.AI_TEMPERATURE,
                max_tokens=settings.AI_MAX_TOKENS,
            )
            response = self.client.chat(chat)
            return response.choices[0].message.content or ""
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"GigaChat недоступен: {type(e).__name__}: {str(e)}",
            )


_ai_service: AIService | None = None


def get_ai_service() -> AIService:
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
