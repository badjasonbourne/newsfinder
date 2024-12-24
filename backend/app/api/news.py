from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.news import News
from ..service.news_service import NewsService

router = APIRouter(
    prefix="/api/news",
    tags=["news"]
)

@router.get("/", response_model=List[News])
async def get_all_news():
    """
    获取所有新闻列表
    """
    try:
        return NewsService.get_all_news()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{news_id}", response_model=News)
async def get_news(news_id: int):
    """
    根据ID获取特定新闻
    """
    news = NewsService.get_news_by_id(news_id)
    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    return news 