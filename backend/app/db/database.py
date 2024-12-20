import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 获取数据库URL
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db():
    try:
        conn = psycopg2.connect(
            DATABASE_URL,
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as error:
        print("Error connecting to the database:", error)
        raise error

def close_db(conn):
    if conn is not None:
        conn.close() 