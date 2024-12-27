'use client';
import { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import NewsCard from './components/NewsCard';

const API_BASE_URL = 'http://localhost:8000/api';

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTag, setActiveTag] = useState('全部');
  const [tags, setTags] = useState(['全部']);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // 使用 Promise.all 确保加载至少持续2秒
        const [data] = await Promise.all([
          fetch(`${API_BASE_URL}/news`).then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch news');
            }
            return response.json();
          }),
          new Promise(resolve => setTimeout(resolve, 5000)) // 2秒延迟
        ]);

        setNews(data);
        
        // 提取所有独特的标签
        const uniqueTags = ['全部', ...new Set(data.map(item => item.tag).filter(Boolean))];
        setTags(uniqueTags);
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 根据当前选中的标签筛选新闻
  const filteredNews = activeTag === '全部' 
    ? news 
    : news.filter(item => item.tag === activeTag);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">出错了</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">今日新闻</h1>
        
        {/* 标签页导航 */}
        <div className="mb-8 whitespace-nowrap border-b border-gray-200 flex flex-row gap-[0px]">
          {tags.map((tag) => (
            <div key={tag} className="inline-block">
              <button
                onClick={() => setActiveTag(tag)}
                className={`px-2 py-2 w-[100px] text-sm font-medium transition-all duration-200`}
              >
                {tag}
              </button>
              <div className={`w-[100px] h-[3px] bg-gray-900 mt-[2px]
                ${activeTag === tag ? 'opacity-100' : 'opacity-0'}
                `}></div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}