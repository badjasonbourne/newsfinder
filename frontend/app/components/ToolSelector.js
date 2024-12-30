import React from 'react';
import useStore from '../store/useStore';

export default function ToolSelector() {
  const {
    toolSelectorOpen,
    toolSelectorPosition,
    hoveredTool,
    handleToolSelect,
    setHoveredTool,
  } = useStore();

  if (!toolSelectorOpen) return null;

  const tools = [
    { id: 'default', icon: 'ri-cursor-line', label: '普通光标' },
    { id: 'lasso', icon: 'ri-drag-move-line', label: '套索' }
  ];

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      style={{ 
        left: toolSelectorPosition.x, 
        top: toolSelectorPosition.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="p-2 space-y-1">
        {tools.map(tool => (
          <div
            key={tool.id}
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
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