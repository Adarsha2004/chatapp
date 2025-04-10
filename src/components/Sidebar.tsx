import React, { useState } from 'react';
import { Plus, Search, Settings } from 'lucide-react';
import { Conversation } from './CommonTypes';

interface SidebarProps {
  sidebarOpen: boolean;
  conversations: Conversation[];
  activeConversation: string;
  createNewConversation: () => void;
  setActiveConversation: (id: string) => void;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  conversations,
  activeConversation,
  createNewConversation,
  setActiveConversation,
  toggleSidebar
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && sidebarOpen) {
      toggleSidebar();
    } else if (isRightSwipe && !sidebarOpen) {
      toggleSidebar();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div 
        className={`fixed md:static h-full bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white flex flex-col shadow-xl rounded-r-xl border-r border-gray-800/40
          transition-all duration-300 ease-in-out transform z-20
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`p-3 border-b border-gray-800/40 flex items-center ${!sidebarOpen && 'md:justify-center'}`}>
          <h2 className={`text-lg font-medium ${!sidebarOpen && 'md:hidden'} animated-gradient-text`}>Memory Lane</h2>
        </div>
        <div className={`p-3 ${!sidebarOpen && 'md:px-2'}`}>
          <button 
            className={`w-full bg-[#459DDC] hover:bg-[#459DDC]/90 text-white font-medium py-2 rounded-xl
              transition-all duration-200 flex items-center justify-center
              ${!sidebarOpen && 'md:p-2'}`}
            onClick={createNewConversation}
          >
            {sidebarOpen ? (
              <span className="text-white">New Conversation</span>
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </button>
          
          {sidebarOpen && (
            <div className="mt-3 relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-2 px-4 pl-10 text-white 
                  placeholder-gray-400 focus:outline-none focus:border-[#459DDC]/50 focus:ring-1 focus:ring-[#459DDC]/30
                  transition-all duration-200"
              />
              <Search className="h-5 w-5 text-[#459DDC] absolute left-3 top-2.5" />
            </div>
          )}
        </div>
        
        {!sidebarOpen && (
          <div className="p-3 md:px-2">
            <button 
              className="w-full bg-gray-800 hover:bg-gray-700 text-[#459DDC] py-2 rounded-xl
                transition-all duration-200 flex items-center justify-center md:p-2"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        )}
        
        <div className={`flex-1 overflow-y-auto ${!sidebarOpen && 'md:hidden'}`}>
          <div className="p-3">
            <h3 className="text-sm text-[#459DDC] uppercase tracking-wider mb-2">History</h3>
            <ul className="space-y-1">
              {conversations.map(conv => (
                <li key={conv.id}>
                  <button 
                    className={`w-full text-left p-2 rounded-lg ${activeConversation === conv.id ? 'bg-gray-800 text-[#459DDC]' : 'hover:bg-gray-800 text-gray-300 hover:text-[#459DDC]'}`}
                    onClick={() => setActiveConversation(conv.id)}
                  >
                    <div className="font-medium truncate">{conv.title}</div>
                    <div className="text-xs text-gray-400">{conv.date}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* User Profile */}
        <div className="mt-auto border-t border-gray-800/40">
          <div className={`p-3 flex items-center ${!sidebarOpen && 'md:justify-center'}`}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#459DDC] to-[#3A7DB5] flex items-center justify-center text-white font-medium text-lg ${!sidebarOpen && 'md:w-8 md:h-8 md:text-sm'}`}>
              AN
            </div>
            {(sidebarOpen || window.innerWidth < 768) && (
              <div className="ml-3">
                <div className="font-medium text-[#459DDC]">Adarsha Natia</div>
              </div>
            )}
            {(sidebarOpen || window.innerWidth < 768) && (
              <button className="ml-auto text-gray-400 hover:text-[#459DDC] transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
