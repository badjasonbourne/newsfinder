import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import breaks from 'remark-breaks';

export default function ArticleModal({ isOpen, onClose, article }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="px-12 py-10">
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm, breaks]}
              components={{
                p: ({node, ...props}) => <p className="mb-4 text-[14px]" {...props} />,
                h2: ({node, ...props}) => <h2 className="mb-4 text-[18px] font-semibold" {...props} />,
                h3: ({node, ...props}) => <h3 className="mb-4 text-[16px] font-semibold" {...props} />,
                h4: ({node, ...props}) => <h4 className="mb-4 text-[14px] font-semibold" {...props} />,
                h5: ({node, ...props}) => <h5 className="mb-4 text-[14px] font-semibold" {...props} />,
                h6: ({node, ...props}) => <h6 className="mb-4 text-[14px] font-semibold" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}