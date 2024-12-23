from jina_reader import JinaReader

def test_crawler():
    urls = ["https://36kr.com/p/3086987956222336", "https://36kr.com/p/3086725066127488"]
    reader = JinaReader()
    results = reader.batch_read(urls)
    print(results)

if __name__ == "__main__":
    test_crawler()