from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserAdminRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    login: str
    email: str
    name: str
    is_admin: bool
    created_at: datetime


class UserAdminUpdate(BaseModel):
    is_admin: bool | None = None
    name: str | None = None