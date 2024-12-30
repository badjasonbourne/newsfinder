'use client';
import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import LoadingSpinner from './components/LoadingSpinner';
import NewsCard from './components/NewsCard';

const API_BASE_URL = 'http://localhost:8000/api';

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTag, setActiveTag] = useState('全部');
  const [tags, setTags] = useState(['全部']);
  const [hoverTag, setHoverTag] = useState(null);
  const sliderRef = useRef(null);
  const tagsContainerRef = useRef(null);

  // 初始化滑块位置
  useEffect(() => {
    if (tagsContainerRef.current && sliderRef.current) {
      const activeButton = tagsContainerRef.current.querySelector('button');
      if (activeButton) {
        const rect = activeButton.getBoundingClientRect();
        const containerRect = tagsContainerRef.current.getBoundingClientRect();
        
        sliderRef.current.style.left = `${rect.left - containerRect.left}px`;
        sliderRef.current.style.width = `${rect.width}px`;
        sliderRef.current.style.height = `${rect.height}px`;
      }
    }
  }, [loading]); // 当loading状态改变时（即数据加载完成后）执行

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
          new Promise(resolve => setTimeout(resolve, 1000)) // 1秒延迟
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
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
        <div className="mb-8 whitespace-nowrap border-b border-gray-200 flex flex-row gap-[0px] relative" ref={tagsContainerRef}>
          {/* 动画滑块 */}
          <div 
            ref={sliderRef}
            className="absolute bg-[#E8E8E8] rounded-[4px] transition-opacity duration-200"
            style={{
              opacity: hoverTag ? 1 : 0,
              pointerEvents: 'none'
            }}
          />
          
          {tags.map((tag) => (
            <div key={tag} className="inline-block">
              <button
                onClick={() => setActiveTag(tag)}
                onMouseEnter={(e) => {
                  setHoverTag(tag);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const containerRect = tagsContainerRef.current.getBoundingClientRect();
                  
                  anime({
                    targets: sliderRef.current,
                    left: rect.left - containerRect.left,
                    width: rect.width,
                    height: rect.height,
                    easing: 'easeOutExpo',
                    duration: 600
                  });
                }}
                onMouseLeave={() => {
                  setHoverTag(null);
                }}
                className={`px-[16px] py-[6px] rounded-[4px] text-sm font-medium text-center relative`}
              >
                {tag}
              </button>
              <div className={`h-[2px] bg-gray-700 mt-[4px] transition-opacity duration-200
                ${activeTag === tag ? 'opacity-100' : 'opacity-0'}
                `}>
              </div>
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
