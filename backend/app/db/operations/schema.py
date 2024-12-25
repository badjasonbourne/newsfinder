from backend.app.db.database import get_db, close_db

def create_tables(sql):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute(sql)
        conn.commit()
        print("Table created successfully.")
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        close_db(conn)

if __name__ == '__main__':
    # 创建标签表
    create_tables("""
    CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );
    """)
    
    # 创建新闻-标签关联表
    create_tables("""
    CREATE TABLE IF NOT EXISTS news_tags (
        news_id INT4 NOT NULL,
        tag_id INT4 NOT NULL,
        PRIMARY KEY (news_id, tag_id),
        FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
    );
    """)
    
    # 创建触发器函数来确保每条新闻至少有一个标签
    create_tables("""
    CREATE OR REPLACE FUNCTION check_news_tags()
    RETURNS TRIGGER AS $$
    BEGIN
        -- 在删除标签关系时检查
        IF TG_OP = 'DELETE' THEN
            IF NOT EXISTS (
                SELECT 1 FROM news_tags 
                WHERE news_id = OLD.news_id 
                AND tag_id != OLD.tag_id
            ) THEN
                RAISE EXCEPTION '每条新闻必须至少有一个标签';
            END IF;
        END IF;
        RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
    """)
    
    # 创建触发器
    create_tables("""
    DROP TRIGGER IF EXISTS ensure_news_has_tags ON news_tags;
    CREATE TRIGGER ensure_news_has_tags
    BEFORE DELETE ON news_tags
    FOR EACH ROW
    EXECUTE FUNCTION check_news_tags();
    """)
    