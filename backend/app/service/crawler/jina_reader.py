import requests
import time
import ell
import openai
import json
import re
from datetime import datetime
import pytz
import os
from dotenv import load_dotenv

load_dotenv()

client = openai.OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url=os.getenv("OPENROUTER_BASE_URL")
)

@ell.simple(model="google/gemini-pro-1.5", client=client)
def extract_news(text: str):
    """You are a helpful assistant."""

    tz = pytz.timezone('Asia/Shanghai')
    beijing_time = datetime.now(tz).strftime('%Y-%m-%d')

    return f"""
Extract news articles from the given 36kr author page text and return them in a clean JSON format.

Requirements:
1. For each related article, extract and return ONLY:
   - title: A rewritten, formal and concise version of the original headline
     - Remove unnecessary prefixes like "出海速递｜", "36氪出海·关注｜" etc.
     - Keep it professional and straight to the point
     - Avoid sensational language and punctuation
   - link: The full article URL
   - date: The date of the article.
   - tags: The tags of the article (Notably, only select one tag that is most relevant to the article). ONLY select tags from the following list:
     <tags_list>
     1. 云计算
     2. 大模型LLM
     3. 出海资讯
     4. AI社交
     5. 协同办公
     </tags_list>

2. **IMPORTANT**: If you think a article can not be tagged based on the tag list above, please ignore it.

3. Format requirements:
   - Return ONLY a valid JSON array containing these article objects
   - No additional text or formatting outside the JSON
   - Ensure proper JSON syntax with correct quotes and commas
   - Do not include HTML, markdown or other formatting
   - Answer in Chinese.

Example format:
[
  {{
    "title": "xxxx",
    "link": "https:xxx",
    "date": "YYYY-MM-DD",
    "tags": "xxx"
  }}
]

To be noticed, today is {beijing_time}.

Parse the following text and return ONLY the JSON array:
<text>
{text}
</text>
"""

class JinaReader:
    def __init__(self):
        self.jina_url = os.getenv("JINA_API_URL")
    
    def read(self, url: str) -> str:
        jina_url = f"{self.jina_url}/{url}"
        response = requests.get(jina_url)
        return response.text

    def batch_read(self, urls: list[str]) -> list[str]:
        results = []
        for url in urls:
            try:
                content = self.read(url)
                results.append(content)
            except Exception as e:
                print(f"Error reading {url}: {e}")
            time.sleep(10)
        return results

    def menu_list_36kr(self, url: str) -> list[dict]:
        """
        从返给定 URL 中获取文本，提取第二个"搜索"到"查看更多"之间的片段，
        然后通过 extract_news 函数获取到 JSON 字符串，最终将其解析为字典列表回。
        """
        text = self.read(url)

        # 首先查找第一个"搜索"
        first_search_index = text.find("搜索")
        if first_search_index == -1:
            return []
        
        # 接着查找相对于第一个"搜索"之后的第二个"搜索"
        second_search_index = text.find("搜索", first_search_index + len("搜索"))
        if second_search_index == -1:
            return []
        
        # 从第二个"搜索"位置开始查找"查看更多"
        more_index = text.find("查看更多", second_search_index)
        if more_index == -1:
            return []
        
        result = text[second_search_index:more_index].strip()
        result_str = extract_news(result)
        clean_str = re.sub(r'```(json)?', '', result_str).strip()

        try:
            data = json.loads(clean_str)
        except:
            data = []
        
        return data
    
    def menu_list_general(self, url: str) -> list[dict]:
        text = self.read(url)
        result_str = extract_news(text)
        clean_str = re.sub(r'```(json)?', '', result_str).strip()

        try:
            data = json.loads(clean_str)
        except:
            data = []
        
        return data

if __name__ == "__main__":
    reader = JinaReader()
    url = "https://letschuhai.com/recent"
    text = reader.menu_list_general(url)
    print(text)
