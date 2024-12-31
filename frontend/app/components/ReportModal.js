import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import breaks from 'remark-breaks';
import useStore from '../store/useStore';

export default function ReportModal() {
  const { showReport, setShowReport, selectedNews, setSelectedNews } = useStore();

  useEffect(() => {
    if (showReport) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReport]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateReportContent());
      alert('已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleUnselectNews = (newsId) => {
    setSelectedNews(selectedNews.filter(news => news.id !== newsId));
  };

  const generateReportContent = () => {
    let content = '';
    
    selectedNews.forEach((news, index) => {
      content += `## ${index + 1}. ${news.title}\n\n`;
      if (news.ai_description) content += `${news.ai_description}\n\n`;
      content += `原文链接：${news.link}\n\n`;
    });
    
    return content;
  };

  if (!showReport) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-[#212A2C]/10 z-50 flex items-center justify-center p-4 default-cursor">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white px-6 py-3 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold">报告预览</h2>
          <button
            onClick={() => setShowReport(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div className="w-[85%] mx-auto py-6">
          <div className="prose max-w-none">
            {selectedNews.map((news, index) => (
              <div key={news.id} className={`relative group border-gray-300/50 border-t-[0.5px] border-l-[0.5px] border-r-[0.5px] py-5 px-5 ${index === selectedNews.length - 1 ? 'border-b-[0.5px]' : ''}`}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-[18px] font-semibold">{`${index + 1}. ${news.title}`}</h2>
                  <button
                    onClick={() => handleUnselectNews(news.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <i className="ri-delete-bin-fill"></i>
                  </button>
                </div>
                {news.ai_description && (
                  <p className="mb-4 text-[14px]">{news.ai_description}</p>
                )}
                <p className="text-[14px]">链接：{news.link}</p>
              </div>
            ))}
          </div>
          <div className="bg-white py-3 flex justify-end">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-[#134648] rounded-md text-white text-[13px] hover:bg-[#0d3234] transition-colors"
            >
              复制内容
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 