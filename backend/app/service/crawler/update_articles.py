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

model_powerful = "deepseek/deepseek-chat"
model_light = "google/gemini-flash-1.5"


@ell.simple(model=model_powerful, client=client)
def summarize_article(text: str):
    """你擅长总结新闻文本。你的语言干脆利落有节奏有张力，写作风格模仿黑色幽默作家萧伯纳，擅长用黑色幽默的大白话来总结文本，让读者一读就懂。"""
    return f"""
请用30到50个字概括以下新闻文章：
<text>
{text}
</text>

请**严格**遵循以下规则：
1. 使用萧伯纳的口吻，略带黑色幽默，并以段落格式回应，不要使用列表。
2. 字数限制在30-50字，严禁超过50字。
3. 请直接自然地总结，专注于关键内容的表述，严禁使用"这篇文章"或"这则新闻"等表述，见如下例子：
<example>
这是不好的例子：
<poor_example>
这篇文章讨论了苹果最新的产品发布会，文中提到该公司推出了...
</poor_example>
这是好的例子：
<good_example>
苹果发布售价3,499美元的Vision Pro头显，具备先进的混合现实功能和全新操作系统...
</good_example>
</example>

使用萧伯纳的口吻，略带黑色幽默的大白话来总结文本，让读者一读就懂。

直接输出摘要，不要其他信息。无论文章使用何种语言，你的回答都必须用中文。请以段落形式回答，不要用列表。

请将摘要放在<summary>标签中，不要包含任何其他信息。例如：
<summary>
xxxxxxxx
</summary>
"""

@ell.simple(model=model_light, client=client)
def title_generator(text: str):
    """你擅长根据文本内容生成合理的标题"""
    return f"""
为以下新闻文章生成标题：
<text>
{text}
</text>

直接输出标题，不要包含其他信息。无论文章使用何种语言，你的回应应为中文。标题应简洁且信息丰富，不超过10个汉字。

将标题放在<title>标签中，不要包含其他信息。例如：
<title>
xxxxxxxx
</title>
"""

@ell.simple(model=model_powerful, client=client)
def extract_content(text: str):
    """你擅长从Markdown文本中总结新闻文章的内容，这些文本是从网站上爬取的，可能包含一些不相关的内容。你写作风格模仿黑色幽默作家萧伯纳，擅长用风趣幽默的大白话来总结文本，让读者一读就懂。"""
    return f"""
你需要从提供的网页内容中提取主要的新闻内容。你应该遵循一个非常清晰的逻辑，使读者能够清楚地理解新闻内容。

你将处理的文本是：
<text>
{text}
</text>

请**严格**遵循以下规则：
1. 使用萧伯纳的口吻，略带黑色幽默，并以段落格式回应，不要使用列表。
2. 你的每个段落最多不超过100个字。
3. 如果你想加粗某些文本并且文本中有“。”，你应该使用 **xxxxx。** 而不是 **xxxxx。**
4. 请直接自然地总结，专注于关键内容的表述，严禁使用"这篇文章"或"这则新闻"等表述，见如下例子：
<example>
这是不好的例子：
<poor_example>
这篇文章讨论了苹果最新的产品发布会，文中提到该公司推出了...
</poor_example>
这是好的例子：
<good_example>
苹果发布售价3,499美元的Vision Pro头显，具备先进的混合现实功能和全新操作系统...
</good_example>
</example>

直接输出内容，不要包含其他信息。无论文章使用何种语言，你的回应都应使用中文。

将内容放在 <content> 标签中，不要包含其他信息，**格式化为markdown**。例如：
<content>
xxxxxxxx
</content>
"""

@ell.simple(model=model_powerful, client=client)
def all_in_one(text: str):
    """你擅长从Markdown文本中总结新闻文章的内容，这些文本是从网站上爬取的，可能包含一些不相关的内容。你写作风格模仿黑色幽默作家萧伯纳，擅长用风趣幽默的大白话来总结文本，让读者一读就懂。"""
    return f"""
你需要从提供的网页内容中提取主要的新闻内容。你应该遵循一个非常清晰的逻辑，使读者能够清楚地理解新闻内容。

你将处理的文本是：
<text>
{text}
</text>

按照如下步骤处理：
1. 第一步：深度理解全文内容，拟定一个巧妙但正式的标题，让读者“既知其事，又得其理”。
2. 第二步：深度理解全文内容，并写一个不超过30-50字的凝炼的概览。
3. 第三步：对文章的主要内容进行复述，字数控制在原文本的30%-50%，不要超字数。不要引入原文不存在的内容。使用Markdown格式化。


请**严格**遵循以下规则：
1. 使用萧伯纳的口吻，略带黑色幽默，并以段落格式回应，不要使用列表。
2. 你的每个段落最多不超过100个字。
3. 如果你想加粗某些文本并且文本中有“。”，你应该使用 **xxxxx。** 而不是 **xxxxx。**
4. 请直接自然地总结，专注于关键内容的表述，严禁使用"这篇文章"或"这则新闻"等表述，见如下例子：
<example>
这是不好的例子：
<poor_example>
这篇文章讨论了苹果最新的产品发布会，文中提到该公司推出了...
</poor_example>
这是好的例子：
<good_example>
苹果发布售价3,499美元的Vision Pro头显，具备先进的混合现实功能和全新操作系统...
</good_example>
</example>

直接输出内容，不要包含其他信息。无论文章使用何种语言，你的回应都应使用中文。

将标题内容放在 <title> 标签中，概览内容放在<summary>标签中，复述内容放在<content>标签中。按照如下格式：
<title>
xxxxxxxx
</title>
<summary>
xxxxxxxx
</summary>
<content>
xxxxxxxx
</content>
"""

def example_extract_title(content: str) -> str:
    result = content.split("<title>")[1].split("</title>")[0]
    return result.strip()

def example_extract_summary(content: str) -> str:
    result = content.split("<summary>")[1].split("</summary>")[0]
    return result.strip()

def example_extract_content(content: str) -> str:
    result = content.split("<content>")[1].split("</content>")[0]
    return result.strip()

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
                
                content = all_in_one(content)
                title = example_extract_title(content)
                summary = example_extract_summary(content)
                content = example_extract_content(content)
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

def update_news_deprecated(url: str):
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
