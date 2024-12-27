from backend.app.db.database import get_db, close_db

def delete_news_range(start_id: int, end_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        # 开始事务
        cur.execute("BEGIN;")
        
        # 临时禁用触发器
        cur.execute("ALTER TABLE news_tags DISABLE TRIGGER ensure_news_has_tags;")
        
        # 删除指定范围的新闻
        # 注意：由于news_tags表的外键设置了ON DELETE CASCADE，
        # 相关的news_tags记录会自动删除
        cur.execute("""
            DELETE FROM news 
            WHERE id BETWEEN %s AND %s;
        """, (start_id, end_id))
        
        # 重新启用触发器
        cur.execute("ALTER TABLE news_tags ENABLE TRIGGER ensure_news_has_tags;")
        
        # 提交事务
        cur.execute("COMMIT;")
        
        print(f"Successfully deleted news with IDs from {start_id} to {end_id}")
        
    except Exception as e:
        # 发生错误时回滚
        cur.execute("ROLLBACK;")
        print(f"Error deleting news: {e}")
    finally:
        close_db(conn)

if __name__ == '__main__':
    # 删除ID从106到121的新闻
    delete_news_range(136, 137)
