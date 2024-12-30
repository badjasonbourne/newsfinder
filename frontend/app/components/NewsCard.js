import React, { useState } from 'react';
import ArticleModal from './ArticleModal';

export default function NewsCard({ item, selectable, selected, onSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <article 
        className={`rounded-[2px] text-[14px] overflow-hidden border-[0.5px] relative group
          transition-all duration-300 ease-in-out
          ${selectable ? 'cursor-pointer hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]' : ''} 
          ${selected 
            ? 'border-[#134648] border-2 shadow-none' 
            : selectable 
              ? 'border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)]' 
              : 'border-gray-200'
          }`}
        onClick={(e) => {
          if (e.target.closest('button')) return;
          selectable && onSelect && onSelect(item);
        }}
      >
        {item.tag && (
          <span className="absolute bg-[#134648] text-[13px] text-white top-0 left-0 rounded-br-[4px] px-3 py-1">
            {item.tag}
          </span>
        )}
        {item.imageurl && (
          <img
            src={item.imageurl}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-[12px] right-[12px] w-[32px] h-[32px] text-[18px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
        >
          <i className="ri-expand-diagonal-line"></i>
        </button>
        <div className="px-8 pt-10 pb-4">
          <h2 className="text-[18px] font-semibold mb-1">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#348FA2] transition-colors duration-200"
              onClick={(e) => {
                if (selectable) {
                  e.preventDefault(); // 在选择模式下阻止链接跳转
                }
              }}
            >
              {item.title}
            </a>
          </h2>
          {item.date && (
            <p className="text-[#88999C] text-[14px] mb-2">
              {item.date}
            </p>
          )}
          {item.ai_description && (
            <p className="">
              {item.ai_description}
            </p>
          )}
        </div>
      </article>

      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={item}
      />
    </>
  );
} 