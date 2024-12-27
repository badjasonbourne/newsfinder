import React from 'react';

export default function NewsCard({ item }) {
  return (
    <article className="rounded-[2px] text-[14px] overflow-hidden border-[0.5px] border-gray-300 relative group">
      {item.tag && (
        <span className="absolute bg-[#195A5D] text-[13px] text-white top-0 left-0 rounded-br-[4px] px-3 py-1">
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
      <div className="absolute top-[12px] right-[12px] w-[24px] h-[24px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <i className="ri-expand-diagonal-line"></i>
      </div>
      <div className="px-8 pt-10 pb-4">
        <h2 className="text-[18px] font-semibold mb-2">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#348FA2] transition-colors duration-200"
          >
            {item.title}
          </a>
        </h2>
        {item.ai_description && (
          <p className="">
            {item.ai_description}
          </p>
        )}
      </div>
    </article>
  );
} 