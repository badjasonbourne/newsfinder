from backend.app.service.crawler.jina_reader import JinaReader
from backend.app.db.database import get_db, close_db
import ell
import openai


client = openai.OpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1"
)

model = "google/gemini-flash-1.5"

@ell.simple(model=model, client=client)
def summarize_article(text: str):
    """You are good at summarizing news articles."""
    return f"""
Summarize the following news articlem, at least 30 words, at most 50 words:
<text>
{text}
</text>

Directly output the summary, no other information. No matter what language the article is, your response should be in Chinese. Respond in paragraph format, no list.

Put the summary in <summary> tags, without any other information. For example:
<summary>
xxxxxxxx
</summary>
"""

@ell.simple(model=model, client=client)
def title_generator(text: str):
    """You are good at generating titles for news articles."""
    return f"""
Generate a title for the following news article:
<text>
{text}
</text>

Directly output the title, no other information. No matter what language the article is, your response should be in Chinese. The title should be concise and informative, no more than 10 Chinese characters.

Put the title in <title> tags, without any other information. For example:
<title>
xxxxxxxx
</title>
"""

@ell.simple(model=model, client=client)
def extract_content(text: str):
    """Your are good at extracting the content of a news from a markdown text, which is crawled from a website, containing some irrelevant content."""
    return f"""
Extract the content of the following news article:
<text>
{text}
</text>

Directly output the content, no other information. Please do not include any other information in your response. Use the original text related the topic, but not the whole text. No matter what language the article is, your response should be in Chinese.

Put the content in <content> tags, without any other information. For example:
<content>
xxxxxxxx
</content>
"""

reader = JinaReader()

feed_list = reader.menu_list_general("https://36kr.com/search/articles/%E4%BA%91%E8%AE%A1%E7%AE%97?sort=date")

for feed in feed_list:
    title = feed["title"]
    link = feed["link"]
    content = reader.read(link)
    summary = summarize_article(content).replace("<summary>", "").replace("</summary>", "")
    content = extract_content(content).replace("<content>", "").replace("</content>", "")
    title = title_generator(content).replace("<title>", "").replace("</title>", "")
    
    # 将上述信息存储为一个字典
    feed_dict = {
        "title": title,
        "ai_description": summary,
        "content": content,
        "link": link
    }
    
    try:
        # 获取数据库连接
        conn = get_db()
        cur = conn.cursor()
        
        # 执行INSERT操作
        cur.execute("""
            INSERT INTO news (title, content, ai_description, link)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (
            feed_dict["title"],
            feed_dict["content"],
            feed_dict["ai_description"],
            feed_dict["link"]
        ))
        
        # 获取插入的ID
        result = cur.fetchone()
        
        # 提交事务
        conn.commit()
        
        print(f"成功插入新闻，ID: {result['id']}")
        
    except Exception as e:
        print(f"插入新闻失败: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        # 关闭游标和连接
        if cur:
            cur.close()
        if conn:
            close_db(conn)
