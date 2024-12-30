import React from 'react';

export default function ToolSelector({ isOpen, onSelect, position }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="p-2 space-y-1">
        <button
          onClick={() => onSelect('default')}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <i className="ri-cursor-line mr-2"></i>
          普通光标
        </button>
        <button
          onClick={() => onSelect('lasso')}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
        >
          <i className="ri-drag-move-line mr-2"></i>
          套索
        </button>
      </div>
    </div>
  );
} 