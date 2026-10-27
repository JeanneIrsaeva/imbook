from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from app.models.chat import Message


class CharacterCreate(BaseModel):
    book_id: int
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    system_prompt: str | None = None


class CharacterRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    book_id: int
    name: str
    description: str | None


class MessageCreate(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    dialog_id: int
    text: str
    sender: str           # "user" | "character"
    created_at: datetime


class DialogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    character_id: int
    started_at: datetime
    character: CharacterRead
    messages: list[MessageRead] = []


class DialogStart(BaseModel):
    character_id: int


class SendMessageResponse(BaseModel):
    user_message: MessageRead
    character_message: MessageRead