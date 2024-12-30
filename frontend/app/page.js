'use client';
import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import Image from 'next/image';
import LoadingSpinner from './components/LoadingSpinner';
import NewsCard from './components/NewsCard';
import ReportModal from './components/ReportModal';

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
  const [selectMode, setSelectMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState([]);
  const [showReport, setShowReport] = useState(false);

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

  // Add this function to generate report content
  const generateReportContent = () => {
    const today = new Date().toLocaleDateString('zh-CN');
    let content = `# 新闻摘要报告\n\n生成日期：${today}\n\n`;
    
    selectedNews.forEach((news, index) => {
      content += `## ${index + 1}. ${news.title}\n\n`;
      if (news.date) content += `日期：${news.date}\n\n`;
      if (news.ai_description) content += `${news.ai_description}\n\n`;
      content += `原文链接：${news.link}\n\n`;
    });
    
    return content;
  };

  // Add handler for news selection
  const handleNewsSelect = (newsItem) => {
    setSelectedNews(prev => {
      const isSelected = prev.some(item => item.id === newsItem.id);
      if (isSelected) {
        return prev.filter(item => item.id !== newsItem.id);
      } else {
        return [...prev, newsItem];
      }
    });
  };

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
    <main className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ease-in-out
      ${selectMode ? 'bg-gray-100' : 'bg-white'}`}>
      <div className={`max-w-[80%] mx-auto transition-all duration-300 ease-in-out
        ${selectMode ? 'opacity-90' : 'opacity-100'}`}>
        <div className="flex justify-center mb-3 mx-auto">
          <Image src="/Logo_1.svg" alt="Logo" width={220} height={100} priority />
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setSelectMode(!selectMode);
                if (selectMode) {
                  setSelectedNews([]);
                }
              }}
              className={`px-4 py-2 text-white rounded-md transition-colors duration-200
                ${selectMode 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-[#134648] hover:bg-[#0d3234]'}`}
            >
              {selectMode ? '取消选择' : '生成报告'}
            </button>
            
            {selectMode && selectedNews.length > 0 && (
              <button
                onClick={() => setShowReport(true)}
                className="px-4 py-2 bg-[#348FA2] text-white rounded-md hover:bg-[#267a8d] transition-colors"
              >
                预览报告 ({selectedNews.length})
              </button>
            )}
          </div>
        </div>

        <div className="mb-8 whitespace-nowrap border-b border-gray-200 flex flex-row gap-[0px] relative" ref={tagsContainerRef}>
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
                className={`px-[16px] py-[6px] rounded-[4px] text-[14px] font-medium text-center relative`}
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

        <div className="grid gap-8 md:grid-cols-2">
          {filteredNews.map((item) => (
            <NewsCard 
              key={item.id} 
              item={item}
              selectable={selectMode}
              selected={selectedNews.some(news => news.id === item.id)}
              onSelect={handleNewsSelect}
            />
          ))}
        </div>
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        content={generateReportContent()}
      />
    </main>
  );
}
