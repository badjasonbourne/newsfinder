from database import get_db, close_db
from datetime import date

def test_connection():
    """
    测试数据库连接
    """
    try:
        # 获取数据库连接
        conn = get_db()
        
        # 创建游标
        cur = conn.cursor()
        
        # 执行简单查询
        cur.execute('SELECT 1')
        result = cur.fetchone()
        
        # 关闭游标
        cur.close()
        
        # 关闭连接
        close_db(conn)
        
        print("数据库连接测试成功！")
        return True
    except Exception as e:
        print(f"数据库连接测试失败：{str(e)}")
        return False

def test_insert():
    """
    测试INSERT操作
    """
    try:
        # 获取数据库连接
        conn = get_db()
        
        # 创建游标
        cur = conn.cursor()
        
        # 执行INSERT操作到news表
        cur.execute("""
            INSERT INTO news (title, content, date, imageurl) 
            VALUES (%s, %s, %s, %s) 
            RETURNING id
        """, (
            "测试新闻标题", 
            "这是一条测试新闻内容", 
            date.today(),
            "https://example.com/test-image.jpg"
        ))
        
        # 获取插入的ID
        result = cur.fetchone()
        
        # 提交事务
        conn.commit()
        
        # 关闭游标
        cur.close()
        
        # 关闭连接
        close_db(conn)
        
        print(f"INSERT测试成功！插入的新闻ID: {result['id']}")
        return True
    except Exception as e:
        print(f"INSERT测试失败：{str(e)}")
        return False

if __name__ == "__main__":
    print("开始测试数据库连接...")
    test_connection()
    print("\n开始测试INSERT操作...")
    test_insert() 