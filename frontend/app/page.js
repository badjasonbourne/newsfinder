'use client';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import Image from 'next/image';
import LoadingSpinner from './components/LoadingSpinner';
import NewsCard from './components/NewsCard';
import ReportModal from './components/ReportModal';
import ToolSelector from './components/ToolSelector';
import OnboardingModal from './components/OnboardingModal';
import useStore from './store/useStore';

export default function Home() {
  const {
    news,
    loading,
    error,
    activeTag,
    tags,
    selectedNews,
    currentTool,
    toolSelectorOpen,
    toolSelectorPosition,
    hoveredTool,
    isSelecting,
    showReport,
    fetchNews,
    setActiveTag,
    handleToolSelect,
    handleNewsSelect,
    setToolSelectorOpen,
    setToolSelectorPosition,
    setHoveredTool,
    setShowReport,
    resetTool,
    checkFirstVisit,
  } = useStore();

  const sliderRef = useRef(null);
  const tagsContainerRef = useRef(null);
  const [hoverTag, setHoverTag] = useState(null);

  // 检查是否为首次访问
  useEffect(() => {
    checkFirstVisit();
  }, [checkFirstVisit]);

  // 处理 Esc 键
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        resetTool();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resetTool]);

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
  }, [loading]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // 处理鼠标中键
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 1) {
        e.preventDefault();
        setToolSelectorPosition({ x: e.clientX, y: e.clientY });
        setToolSelectorOpen(true);
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 1) {
        setToolSelectorOpen(false);
        if (hoveredTool) {
          handleToolSelect(hoveredTool);
        }
      }
    };

    const handleMouseMove = (e) => {
      if (!toolSelectorOpen) return;
      e.preventDefault();
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [toolSelectorOpen, hoveredTool, handleToolSelect, setToolSelectorPosition, setToolSelectorOpen]);

  // 修改光标处理的 useEffect
  useEffect(() => {
    if (currentTool === 'lasso') {
      document.documentElement.classList.add('lasso-cursor');
    } else {
      document.documentElement.classList.remove('lasso-cursor');
    }
    
    return () => {
      document.documentElement.classList.remove('lasso-cursor');
    };
  }, [currentTool]);

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
    <main className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-[80%] mx-auto">
        <div className="flex justify-center mb-3 mx-auto">
          <Image src="/Logo_1.svg" alt="Logo" width={220} height={100} priority />
        </div>
        
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

        {/* 如果有选中的新闻，显示预览报告按钮 */}
        {selectedNews.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={() => setShowReport(true)}
              className="px-4 py-3 text-[14px] bg-[#134648] text-white rounded-[8px] shadow-lg hover:bg-[#0d3234] transition-colors flex items-center gap-2"
            >
              <i className="ri-file-text-line"></i>
              预览报告 ({selectedNews.length})
            </button>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {filteredNews.map((item) => (
            <NewsCard 
              key={item.id} 
              item={item}
              selectable={isSelecting}
              selected={selectedNews.some(news => news.id === item.id)}
              onSelect={handleNewsSelect}
              className="news-card"
            />
          ))}
        </div>
      </div>

      <ToolSelector
        isOpen={toolSelectorOpen}
        onSelect={handleToolSelect}
        position={toolSelectorPosition}
        onHover={setHoveredTool}
        hoveredTool={hoveredTool}
      />

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        content={generateReportContent()}
      />

      <OnboardingModal />
    </main>
  );
}
