from pydantic import BaseModel, ConfigDict, Field


class AuthorBase(BaseModel):
    last_name: str = Field(min_length=1, max_length=128)
    first_name: str = Field(min_length=1, max_length=128)
    middle_name: str | None = Field(default=None, max_length=128)


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(BaseModel):
    last_name: str | None = Field(default=None, min_length=1, max_length=128)
    first_name: str | None = Field(default=None, min_length=1, max_length=128)
    middle_name: str | None = None


class AuthorRead(AuthorBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class AuthorShort(BaseModel):
    """Короткая версия — для вложенных объектов в Book."""
    model_config = ConfigDict(from_attributes=True)
    id: int
    last_name: str
    first_name: str