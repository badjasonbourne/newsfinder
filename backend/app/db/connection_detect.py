from database import get_db, close_db
import time
from typing import Tuple

def check_connection(max_retries: int = 3, retry_delay: int = 5) -> Tuple[bool, str]:
    """
    检查数据库连接是否有效
    
    Args:
        max_retries (int): 最大重试次数
        retry_delay (int): 重试间隔(秒)
    
    Returns:
        Tuple[bool, str]: (是否连接成功, 状态消息)
    """
    for attempt in range(max_retries):
        try:
            conn = get_db()
            cur = conn.cursor()
            
            # 执行简单查询来验证连接
            cur.execute("SELECT 1")
            result = cur.fetchone()
            
            if result:
                close_db(conn)
                return True, "数据库连接正常"
                
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"连接尝试 {attempt + 1} 失败: {str(e)}")
                print(f"等待 {retry_delay} 秒后重试...")
                time.sleep(retry_delay)
            else:
                return False, f"数据库连接失败: {str(e)}"
                
    return False, "达到最大重试次数，连接失败"

if __name__ == '__main__':
    # 测试连接
    is_connected, message = check_connection()
    print(f"连接状态: {message}")