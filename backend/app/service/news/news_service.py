from typing import List, Optional
from backend.app.db.database import get_db, close_db
from backend.app.schemas.news import News

class NewsService:
    @staticmethod
    def get_all_news() -> List[News]:
        conn = None
        try:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                SELECT id, title, content, ai_description, imageurl, link, date
                FROM news
                ORDER BY date DESC, id DESC
                LIMIT 50
            """)
            news_list = cur.fetchall()
            return [News(**news) for news in news_list]
        finally:
            if conn:
                close_db(conn)

    @staticmethod
    def get_news_by_id(news_id: int) -> Optional[News]:
        conn = None
        try:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                SELECT id, title, content, ai_description, imageurl, link, date
                FROM news
                WHERE id = %s
            """, (news_id,))
            news = cur.fetchone()
            return News(**news) if news else None
        finally:
            if conn:
                close_db(conn)
