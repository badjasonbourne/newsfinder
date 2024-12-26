import React from 'react';

export default function NewsCard({ item }) {
  return (
    <article className="rounded-lg overflow-hidden border-[0.5px] border-gray-200">
      {item.imageurl && (
        <img
          src={item.imageurl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {item.title}
          </a>
        </h2>
        {item.tag && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
            {item.tag}
          </span>
        )}
        {item.ai_description && (
          <p className="text-sm">
            {item.ai_description}
          </p>
        )}
      </div>
    </article>
  );
} 