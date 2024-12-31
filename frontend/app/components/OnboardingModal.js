import React, { useEffect } from 'react';
import useStore from '../store/useStore';

export default function OnboardingModal() {
  const { showOnboarding, setShowOnboarding } = useStore();

  useEffect(() => {
    if (showOnboarding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOnboarding]);

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-[#212A2C]/10 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold mb-4">欢迎使用新闻助手</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              这是一个强大的新闻阅读和整理工具。以下是一些基本操作：
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <i className="ri-drag-move-line mr-2"></i>
                套索光标
              </h3>
              <p className="text-gray-600">
                按下鼠标中键可以切换到套索模式，让你快速选择多篇新闻文章进行整理。
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <i className="ri-file-text-line mr-2"></i>
                生成报告
              </h3>
              <p className="text-gray-600">
                选择新闻后，点击右下角的"预览报告"按钮，即可生成新闻摘要报告。
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowOnboarding(false);
              localStorage.setItem('hasVisited', 'true');
            }}
            className="mt-6 w-full px-4 py-2 bg-[#134648] text-white rounded-md hover:bg-[#0d3234] transition-colors"
          >
            开始使用
          </button>
        </div>
      </div>
    </div>
  );
} 