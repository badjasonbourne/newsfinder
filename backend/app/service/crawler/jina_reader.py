import requests
import time
import ell
import openai

client = openai.OpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1"
)

@ell.simple(model="gpt-4o-mini", client=client)
def hello(name: str):
    """You are a helpful assistant."""
    return f"Say a  hello to {name}!"

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

    def menu_list(self, url: str) -> list[str]:
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
        return result


if __name__ == "__main__":
    reader = JinaReader()
    url = "https://36kr.com/user/11918142"
    text = reader.menu_list(url)
    print((text))