from pydantic import BaseModel

class MudraBase(BaseModel):
    name: str
    sanskrit_name: str
    meaning: str
    description: str

class MudraCreate(MudraBase):
    pass

class Mudra(MudraBase):
    id: int

    class Config:
        orm_mode = True
