from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class NoteCreate(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


class NoteUpdate(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


class NoteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    card_id: int
    text: str
    created_at: datetime