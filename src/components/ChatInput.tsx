import React, { useRef } from 'react';
import { Volume2, XCircle, ArrowRight } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  chatAttachment: File | null;
  setChatAttachment: (file: File | null) => void;
  sendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  chatAttachment,
  setChatAttachment,
  sendMessage
}) => {
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const handleChatAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      e.target.value = '';
      return;
    }
    
    setChatAttachment(file);
  };
  
  const removeChatAttachment = () => {
    setChatAttachment(null);
    if (chatFileInputRef.current) {
      chatFileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex flex-col p-2 md:p-4">
        {/* Audio attachment preview */}
        {chatAttachment && (
          <div className="mb-2 ml-2 md:ml-4 flex items-center bg-gray-800/50 py-1.5 md:py-2 px-2 md:px-3 rounded-lg max-w-fit">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-gray-800 flex items-center justify-center mr-2">
              <span className="text-[10px] md:text-xs text-gray-300 uppercase">
                {chatAttachment.name.split('.').pop() || 'mp3'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-white text-xs md:text-sm truncate max-w-[150px] md:max-w-xs font-medium block" title={chatAttachment.name}>{chatAttachment.name}</span>
              <div className="text-[10px] md:text-xs text-gray-400">
                {(chatAttachment.size / 1024).toFixed(0)} KB
              </div>
            </div>
            <button 
              onClick={removeChatAttachment}
              className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              <XCircle className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>
        )}
        
        <div className="flex w-full rounded-2xl shadow-md bg-gray-800/30 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center px-2 md:px-3">
            <button
              onClick={() => chatFileInputRef.current?.click()}
              className="text-gray-400 hover:text-[#459DDC] transition-all duration-300 p-1.5 md:p-2 hover:scale-110"
              title="Attach audio file"
            >
              <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <input 
              type="file" 
              ref={chatFileInputRef}
              accept="audio/*" 
              className="hidden" 
              onChange={handleChatAttachment}
            />
          </div>

          <input
            type="text"
            className="flex-1 py-2.5 md:py-3 px-2 md:px-4 bg-transparent text-white focus:outline-none focus:ring-0 text-sm md:text-base placeholder-gray-400"
            placeholder={chatAttachment ? "Add a message about this audio file..." : "Type a message..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim() && !chatAttachment}
            className={`p-2 md:p-3 mr-1 my-1 transition-all duration-200 rounded-xl ${
              !message.trim() && !chatAttachment
                ? 'bg-transparent text-gray-500'
                : 'bg-gradient-to-r from-[#459DDC] to-[#3A7DB5] text-white hover:shadow-lg btn-pulse'
            }`}
          >
            <span className="flex items-center">
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
