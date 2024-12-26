import React from 'react';

export default function NewsCard({ item }) {
  return (
    <article className="rounded-[2px] text-[14px] overflow-hidden border-[0.5px] border-gray-300 relative">
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
      <div className="p-8">
        <h2 className="text-[18px] font-semibold mb-2">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-200"
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