from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.news import router as news_router

app = FastAPI(title="News API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # NextJS默认端口
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(news_router)

@app.get("/")
async def root():
    return {"message": "Welcome to News API"} 