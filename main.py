from datetime import datetime
import pytz

# 获取北京时区
tz = pytz.timezone('Asia/Shanghai')

# 获取当前北京时间
beijing_time = datetime.now(tz)

# 格式化输出
print(beijing_time.strftime('%Y-%m-%d'))