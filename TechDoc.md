# 新闻聚合网站技术文档

## 1. 技术栈

### 后端
- FastAPI - Python Web框架
- PostgreSQL - 数据库（使用Supabase）
- OpenAI API - AI内容生成
- psycopg2 - PostgreSQL数据库驱动

### 前端  
- Next.js - React框架
- TailwindCSS - CSS框架
- AnimeJS - 动画库
- React-Markdown - Markdown渲染

## 2. 项目结构

### 后端结构
- `/backend/app/`
  - `/api/` - API路由定义
  - `/db/` - 数据库连接管理
  - `/schemas/` - 数据模型定义
  - `/service/`
    - `/crawler/` - 爬虫服务
    - `/news/` - 新闻服务

### 前端结构
- `/frontend/app/`
  - `/components/` - React组件
  - `page.js` - 主页面