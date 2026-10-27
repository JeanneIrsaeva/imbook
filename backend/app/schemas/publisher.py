from pydantic import BaseModel, ConfigDict, Field


class PublisherBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class PublisherCreate(PublisherBase):
    pass


class PublisherUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class PublisherRead(PublisherBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class PublisherShort(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str