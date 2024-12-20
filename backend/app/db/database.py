import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 获取数据库URL
DATABASE_URL = os.getenv("DATABASE_URL")

# 授权用户ID
AUTH_UID = "c40899b1-7ea9-41d6-bd4c-3371a4ce564a"

def get_db():
    try:
        conn = psycopg2.connect(
            DATABASE_URL,
            cursor_factory=RealDictCursor,
            options=f"-c role=authenticated -c request.jwt.claims={{\"sub\":\"{AUTH_UID}\"}}"
        )
        return conn
    except Exception as error:
        print("Error connecting to the database:", error)
        raise error

def close_db(conn):
    if conn is not None:
        conn.close() 