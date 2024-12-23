import requests
import time
import ell
import openai
import json
import re

client = openai.OpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1"
)

@ell.simple(model="google/gemini-flash-1.5", client=client)
def extract_news(text: str):
    """You are a helpful assistant."""

    return f"""
Extract news articles from the given 36kr author page text and return them in a clean JSON format.

Requirements:
1. For each article, extract and return ONLY:
   - title: A rewritten, formal and concise version of the original headline
     - Remove unnecessary prefixes like "出海速递｜", "36氪出海·关注｜" etc.
     - Keep it professional and straight to the point
     - Avoid sensational language and punctuation
   - link: The full article URL

2. Format requirements:
   - Return ONLY a valid JSON array containing these article objects
   - No additional text or formatting outside the JSON
   - Ensure proper JSON syntax with correct quotes and commas
   - Do not include HTML, markdown or other formatting
   - Answer in Chinese.

Example format:
[
  {{
    "title": "xxxx",
    "link": "https:xxx"
  }}
]

Parse the following text and return ONLY the JSON array:
<text>
{text}
</text>
"""

class JinaReader:
    def __init__(self):
        self.jina_url = "https://r.jina.ai"
    
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

    def menu_list(self, url: str) -> list[dict]:
        """
        从返给定 URL 中获取文本，提取第二个“搜索”到“查看更多”之间的片段，
        然后通过 extract_news 函数获取到 JSON 字符串，最终将其解析为字典列表回。
        """
        text = self.read(url)

        # 首先查找第一个“搜索”
        first_search_index = text.find("搜索")
        if first_search_index == -1:
            return []
        
        # 接着查找相对于第一个“搜索”之后的第二个“搜索”
        second_search_index = text.find("搜索", first_search_index + len("搜索"))
        if second_search_index == -1:
            return []
        
        # 从第二个“搜索”位置开始查找“查看更多”
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


if __name__ == "__main__":
    reader = JinaReader()
    url = "https://36kr.com/user/11918142"
    text = reader.menu_list(url)
    print(type(text[0]))
    print(text)