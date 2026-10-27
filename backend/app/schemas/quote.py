from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class QuoteCreate(BaseModel):
    text: str = Field(min_length=1, max_length=5000)
    page_number: int | None = Field(default=None, ge=1)


class QuoteUpdate(BaseModel):
    text: str | None = Field(default=None, min_length=1, max_length=5000)
    page_number: int | None = Field(default=None, ge=1)


class QuoteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    card_id: int
    text: str
    page_number: int | None
    created_at: datetime