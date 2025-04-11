import React, { RefObject } from 'react';
import { ChatMessage } from './CommonTypes';
import AudioPlayer from './AudioPlayer';

interface ChatMessagesProps {
  messages: ChatMessage[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, messagesEndRef }) => {
  return (
    <div className="p-2 md:p-4 space-y-3 md:space-y-4">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`flex p-2 md:p-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}
        >
          <div 
            className={`p-2 md:p-3 max-w-[85%] md:max-w-md text-sm md:text-base shadow-lg ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-[#459DDC] to-[#3A7DB5] text-white ml-auto rounded-2xl rounded-tr-sm' 
                : 'bg-gray-800/80 text-[#459DDC]/90 rounded-2xl rounded-tl-sm'
            }`}
          >
            {msg.text}
            
            {msg.audioFile && (
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-700/30">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] md:text-xs text-gray-300 uppercase">
                      {msg.audioFile.name.split('.').pop() || 'MP3'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm flex flex-col overflow-hidden">
                      <span 
                        className={`truncate font-medium w-full max-w-[180px] sm:max-w-[250px] md:max-w-full block ${msg.role === 'user' ? 'text-white' : 'text-[#459DDC]'}`} 
                        title={msg.audioFile.name}
                      >
                        {msg.audioFile.name}
                      </span>
                      <div className="mt-1 md:mt-2 w-full">
                        <AudioPlayer audioUrl={msg.audioFile.url} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
