from pydantic import BaseModel
from typing import Optional
from datetime import date

class NewsBase(BaseModel):
    date: date
    title: str
    content: str
    ai_description: Optional[str] = None
    imageurl: Optional[str] = None
    link: str

class NewsCreate(NewsBase):
    pass

class News(NewsBase):
    id: int
    tag: Optional[str] = None

    class Config:
        from_attributes = True
