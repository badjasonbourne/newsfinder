import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ArticleModal({ isOpen, onClose, article }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{article.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
          
          {article.imageurl && (
            <img
              src={article.imageurl}
              alt={article.title}
              className="w-full h-64 object-cover mb-4 rounded"
            />
          )}
          
          <div className="prose max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}