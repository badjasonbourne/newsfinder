from backend.app.service.crawler.jina_reader import JinaReader
from backend.app.db.database import get_db, close_db
import ell
import openai
import os
from dotenv import load_dotenv
import time

load_dotenv()

client = openai.OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url=os.getenv("OPENROUTER_BASE_URL")
)

model = "deepseek/deepseek-chat"

@ell.simple(model=model, client=client)
def summarize_article(text: str):
    """You are good at summarizing news articles."""
    return f"""
Summarize the following news articlem, at least 30 words, at most 50 words:
<text>
{text}
</text>

Please summarize the following content directly and naturally, focusing on key points without referring to it as an article or news report.

For example:
<example>
Here is the poor example:
<poor_example>
This article discusses Apple's latest product launch, where the text mentions that the company unveiled...
</poor_example>
Here is the good example:
<good_example>
Apple unveiled its Vision Pro headset priced at $3,499, featuring advanced mixed reality capabilities and a new operating system...
</good_example>
</example>

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
    """Your are good at extracting the news content of a news article from a markdown text, which is crawled from a website, containing some irrelevant content."""
    return f"""
Extract the complete main news article from the provided webpage content, ensuring no details are missed from the primary article. Exclude all auxiliary content like recommended articles, footers, copyright notices, sharing rules, comments, and advertisements. 

The text you will process is, noticing that only one main news is in the text:
<text>
{text}
</text>

Directly output the content, no other information. Please do not include any other information in your response. No matter what language the article is, your response should be in Chinese.

To be noticed, if you want to make some text bold and there is a "。" in the text, you should use **xxxxx.** instead of **xxxxx。**

Remember, Exclude all auxiliary content like recommended articles, footers, copyright notices, sharing rules, comments, and advertisements. 

Put the content in <content> tags, without any other information, **formatted as markdown**. For example:
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
        print("database connected")
        
        for feed in feed_list:
            try:
                # 检查链接是否已存在
                cur.execute("SELECT id FROM news WHERE link = %s", (feed["link"],))
                if cur.fetchone():
                    print(f"链接已存在，跳过: {feed['link']}")
                    continue
                
                print("链接不存在，开始处理")
                title = feed["title"]
                link = feed["link"]
                date = feed["date"]
                content = reader.read(link)
                print(f"link: {link}")
                
                print("use llm to generate necessary information")
                summary = summarize_article(content).replace("<summary>", "").replace("</summary>", "")
                print("summary generated")
                content = extract_content(content).replace("<content>", "").replace("</content>", "")
                print("content generated")
                title = title_generator(content).replace("<title>", "").replace("</title>", "")
                print("title generated")

                time.sleep(4)

                # 执行INSERT操作
                print("准备开始插入数据库")
                cur.execute("""
                    INSERT INTO news (title, content, ai_description, link, date)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id
                """, (title, content, summary, link, date))
                
                result = cur.fetchone()
                news_id = result['id']

                # 处理标签
                if "tags" in feed:
                    tag_name = feed["tags"]
                    # 检查标签是否存在，不存在则创建
                    cur.execute("""
                        INSERT INTO tags (name)
                        VALUES (%s)
                        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                        RETURNING id
                    """, (tag_name,))
                    tag_result = cur.fetchone()
                    tag_id = tag_result['id']

                    # 创建新闻和标签的关联
                    cur.execute("""
                        INSERT INTO news_tags (news_id, tag_id)
                        VALUES (%s, %s)
                    """, (news_id, tag_id))

                conn.commit()
                print(f"成功插入新闻和标签，新闻ID: {news_id}")
                
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
        "https://www.aihub.cn/news/",
        "https://letschuhai.com/recent",
    ]
    batch_update_news(url_list)
