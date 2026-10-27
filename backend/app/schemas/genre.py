from pydantic import BaseModel, ConfigDict, Field


class GenreBase(BaseModel):
    name: str = Field(min_length=1, max_length=128)


class GenreCreate(GenreBase):
    pass


class GenreUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=128)


class GenreRead(GenreBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class GenreShort(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str