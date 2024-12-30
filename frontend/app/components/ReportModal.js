import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import breaks from 'remark-breaks';

export default function ReportModal({ isOpen, onClose, content }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert('已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-[#212A2C]/10 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">新闻报告预览</h2>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-[#134648] text-white rounded-md hover:bg-[#0d3234] transition-colors"
            >
              复制内容
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="px-8 py-6">
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, breaks]}
              components={{
                p: ({node, ...props}) => <p className="mb-4 text-[14px]" {...props} />,
                h2: ({node, ...props}) => <h2 className="mb-4 text-[18px] font-semibold" {...props} />,
                h3: ({node, ...props}) => <h3 className="mb-4 text-[16px] font-semibold" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
} 