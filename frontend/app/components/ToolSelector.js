import React from 'react';

export default function ToolSelector({ isOpen, onSelect, position, onHover, hoveredTool }) {
  if (!isOpen) return null;

  const tools = [
    { id: 'default', icon: 'ri-cursor-line', label: '普通光标' },
    { id: 'lasso', icon: 'ri-drag-move-line', label: '套索' }
  ];

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
        {tools.map(tool => (
          <div
            key={tool.id}
            onMouseEnter={() => onHover(tool.id)}
            onMouseLeave={() => onHover(null)}
            className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded transition-colors
              ${hoveredTool === tool.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <i className={`${tool.icon} mr-2`}></i>
            {tool.label}
          </div>
        ))}
      </div>
    </div>
  );
} 