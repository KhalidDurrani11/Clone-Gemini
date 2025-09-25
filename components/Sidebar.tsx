import React from 'react';
import { Icon } from './Icon';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat, isOpen, onToggle }) => {
  return (
    <div className={`flex flex-col h-full bg-gray-950 border-r border-gray-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800 h-[65px]">
        {isOpen && (
            <div className="flex items-center gap-2">
                <Icon name="gemini" className="w-8 h-8"/>
                <span className="text-xl font-bold">Gemini</span>
            </div>
        )}
        <button onClick={onToggle} className="p-2 hover:bg-gray-800 rounded-lg">
          <Icon name="menu" className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center sm:justify-start gap-3 px-4 py-3 text-left bg-blue-600/50 hover:bg-blue-500/50 rounded-lg transition-colors"
        >
          <Icon name="new-chat" className="w-6 h-6" />
          {isOpen && <span className="text-lg font-semibold">New Chat</span>}
        </button>
      </div>

       <div className={`text-center text-xs text-gray-600 p-4 border-t border-gray-800 ${!isOpen && 'hidden'}`}>
        <p>Gemini Clone</p>
        <p>Built with React & Gemini API</p>
       </div>
    </div>
  );
};