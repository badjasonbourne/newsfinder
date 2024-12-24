from pydantic import BaseModel
from typing import Optional

class NewsBase(BaseModel):
    title: str
    content: str
    ai_description: Optional[str] = None
    imageurl: Optional[str] = None
    link: str

class NewsCreate(NewsBase):
    pass

class News(NewsBase):
    id: int

    class Config:
        from_attributes = True 