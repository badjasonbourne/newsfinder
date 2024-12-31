import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import anime from 'animejs/lib/anime.es.js';

const DemoCard = ({ title, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`rounded-[2px] p-4 border-[0.5px] border-gray-200 cursor-crosshair transition-all
      ${selected ? 'ring-2 ring-[#134648]' : ''}`}
  >
    <h3 className="text-[16px] font-semibold">{title}</h3>
    <p className="text-gray-600 text-[14px] mt-2">示例新闻卡片</p>
  </div>
);

const GuidePanel = ({ step }) => {
  const messages = {
    1: '点击鼠标中键，开启套索选择模式',
    2: '选择"套索"工具，开始选择新闻',
    3: '点击新闻卡片，进行多选操作'
  };

  return (
    <div className="bg-gray-50 px-6 py-4 border-[0.5px] border-gray-200 rounded-lg mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-[16px]">步骤 {step}/3</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#134648] rounded-full flex items-center justify-center">
          {step === 1 && <i className="ri-mouse-line text-2xl text-white"></i>}
          {step === 2 && <i className="ri-drag-move-line text-2xl text-white"></i>}
          {step === 3 && <i className="ri-file-text-line text-2xl text-white"></i>}
        </div>
        <p className="text-gray-600 text-[16px] flex-1">
          {messages[step]}
        </p>
      </div>
    </div>
  );
};

export default function OnboardingModal() {
  const { showOnboarding, setShowOnboarding } = useStore();
  const [step, setStep] = useState(1);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [buttonRef, setButtonRef] = useState(null);

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

  useEffect(() => {
    if (buttonRef && step === 3) {
      anime({
        targets: buttonRef,
        translateY: [-10, 10],
        duration: 1000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutQuad'
      });
    }
  }, [buttonRef, step]);

  const handleMiddleClick = (e) => {
    if (e.button === 1 && step === 1) {
      e.preventDefault();
      setStep(2);
      setShowToolSelector(true);
    }
  };

  const handleMiddleRelease = (e) => {
    if (e.button === 1 && step === 2 && showToolSelector) {
      e.preventDefault();
      setStep(3);
      setShowToolSelector(false);
    }
  };

  const handleToolSelect = () => {
    setStep(3);
    setShowToolSelector(false);
  };

  const handleCardSelect = (index) => {
    if (step === 3) {
      setSelectedCards(prev => {
        const isSelected = prev.includes(index);
        return isSelected 
          ? prev.filter(i => i !== index)
          : [...prev, index];
      });
    }
  };

  if (!showOnboarding) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-md bg-[#212A2C]/10 z-50 flex items-center justify-center p-4"
      onMouseDown={handleMiddleClick}
      onMouseUp={handleMiddleRelease}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-12 py-8">
          <h2 className="text-2xl font-semibold mb-6">欢迎使用Readix</h2>
          
          <GuidePanel step={step} />

          <div className="relative">
            {step === 2 && showToolSelector && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-1 w-48 z-10">
                <div
                  onClick={handleCardSelect}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <i className="ri-drag-move-line mr-2"></i>
                  套索
                </div>
              </div>
            )}

            <div className={`transition-opacity duration-300 ${step === 3 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <DemoCard
                    key={i}
                    title={`示例新闻 ${i}`}
                    selected={selectedCards.includes(i)}
                    onClick={() => handleCardSelect(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {step === 3 && (
            <div 
              ref={setButtonRef}
              className="mt-6 flex justify-end"
            >
              <div className="px-6 py-3 bg-[#134648] text-white rounded-full shadow-lg flex items-center gap-2 pointer-events-none">
                <i className="ri-file-text-line"></i>
                预览报告 ({selectedCards.length})
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setShowOnboarding(false);
              localStorage.setItem('hasVisited', 'true');
            }}
            className="mt-8 w-full px-4 py-2 bg-[#134648] text-white rounded-md hover:bg-[#0d3234] transition-colors"
          >
            {step === 3 ? '完成教程' : '跳过教程'}
          </button>
        </div>
      </div>
    </div>
  );
} 