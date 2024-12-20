from database import get_db, close_db

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

if __name__ == "__main__":
    test_connection() 