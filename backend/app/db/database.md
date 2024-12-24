## 数据库表结构

### news 表

新闻数据表，用于存储新闻相关信息。

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| id | int4 | 是 | 主键，自增 |
| title | text | 是 | 新闻标题 |
| content | text | 是 | 新闻内容 |
| ai_description | text | 否 | AI生成的描述 |
| imageurl | text | 否 | 新闻图片URL |
| link | text | 是 | 新闻链接 |

### 连接信息

数据库连接通过环境变量 `DATABASE_URL` 配置，使用 PostgreSQL 数据库。

### 授权配置

- 使用 Supabase RLS (Row Level Security) 进行访问控制
- INSERT 操作需要授权用户权限
- 当前授权用户 ID: c40899b1-7ea9-41d6-bd4c-3371a4ce564a
- 数据库连接时通过 options 参数设置授权信息：
  ```python
  options="-c role=authenticated -c request.jwt.claims={\"sub\":\"[AUTH_UID]\"}"
  ```

### 测试用例

- `test_connection.py` 包含两个测试函数：
  1. `test_connection()`: 测试基本数据库连接
  2. `test_insert()`: 测试授权用户的 INSERT 操作

### 注意事项

- 数据库连接使用 psycopg2 驱动
- 查询结果使用 RealDictCursor 返回字典格式数据
- 确保在使用完数据库连接后调用 close_db() 关闭连接
- INSERT 操作需要显式调用 commit() 提交事务