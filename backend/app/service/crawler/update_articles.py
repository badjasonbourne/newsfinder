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

def update_news(url: str):
    feed_list = reader.menu_list_general(url)

    try:
        # 在循环外获取数据库连接
        conn = get_db()
        cur = conn.cursor()
        
        for feed in feed_list:
            try:
                # 检查链接是否已存在
                cur.execute("SELECT id FROM news WHERE link = %s", (feed["link"],))
                if cur.fetchone():
                    print(f"链接已存在，跳过: {feed['link']}")
                    continue
                    
                title = feed["title"]
                link = feed["link"]
                content = reader.read(link)

                summary = summarize_article(content).replace("<summary>", "").replace("</summary>", "")
                content = extract_content(content).replace("<content>", "").replace("</content>", "")
                title = title_generator(content).replace("<title>", "").replace("</title>", "")
                
                # 执行INSERT操作
                cur.execute("""
                    INSERT INTO news (title, content, ai_description, link)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                """, (title, content, summary, link))
                
                result = cur.fetchone()
                conn.commit()
                print(f"成功插入新闻，ID: {result['id']}")
                
            except Exception as e:
                print(f"处理新闻失败: {str(e)}")
                conn.rollback()
                continue

    except Exception as e:
        print(f"数据库操作失败: {str(e)}")
    finally:
        # 循环结束后关闭资源
        if cur:
            cur.close()
        if conn:
            close_db(conn)

def batch_update_news(url_list: list[str]):
    for url in url_list:
        update_news(url)
        print(f"更新完成: {url}")


if __name__ == "__main__":
    url_list = [
        "https://36kr.com/search/newsflashes/%E9%98%BF%E9%87%8C%E4%BA%91",
        "https://36kr.com/search/newsflashes/%E8%85%BE%E8%AE%AF%E4%BA%91",
        "https://36kr.com/search/articles/%E5%A4%A7%E6%A8%A1%E5%9E%8B",
    ]
    batch_update_news(url_list)