from backend.app.db.database import get_db, close_db

def create_news_table(sql):
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
    sql = """
        CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            ai_description TEXT,
            imageurl TEXT,
            link TEXT NOT NULL,
            date DATE NOT NULL
        );
    """
    create_news_table(sql)