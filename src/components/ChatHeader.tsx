import React from 'react';
import { Conversation } from './CommonTypes';
import { FolderOpenDot } from 'lucide-react';

interface ChatHeaderProps {
  sidebarOpen: boolean; 
  toggleSidebar: () => void;
  activeConversation: string;
  conversations: Conversation[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  toggleSidebar,
  activeConversation,
  conversations
}) => {
  const activeTitle = conversations.find(c => c.id === activeConversation)?.title || 'Memory Lane';
  
  return (
    <div className="py-2 md:py-3 bg-transparent backdrop-blur-sm flex items-center sticky top-0 z-10 shadow-sm border-b border-gray-800/40 w-full">
      <button 
        onClick={toggleSidebar}
        className="p-1.5 md:p-2 rounded-full hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#459DDC] ml-2 md:ml-3"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#459DDC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M15 3v18"/>
            <path d="m10 15-3-3 3-3"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#459DDC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M15 3v18"/>
          </svg>
        )}
      </button>
      <div className="flex-1 flex justify-center px-2">
        <h1 
          className="text-base md:text-xl font-semibold animated-gradient-text truncate max-w-[150px] sm:max-w-[250px] md:max-w-xs lg:max-w-md"
          title={activeTitle}
        >
          {activeTitle}
        </h1>
      </div>
      
      
      {/* Ayush:myspacebutton */}
      <button
        className="p-1.5 md:p-2 text-blue-500 mr-1"
        onClick={() => {/* myspacefunction */}}
      >
        <FolderOpenDot className="w-6 h-6" />
      </button>


    </div>
  );
};

export default ChatHeader;
