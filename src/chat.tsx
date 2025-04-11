import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Conversation } from './components/CommonTypes';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';

const welcomeWords = [
  { text: "Upload", className: "text-sm sm:text-sm md:text-base lg:text-lg" },
  { text: "search", className: "text-sm sm:text-sm md:text-base lg:text-lg" },
  { text: "and chat", className: "text-sm sm:text-sm md:text-base lg:text-lg" },
  { text: "with your", className: "text-sm sm:text-sm md:text-base lg:text-lg" },
  { text: "audio", className: "text-sm sm:text-sm md:text-base lg:text-lg text-[#459DDC]" },
  { text: "files.", className: "text-sm sm:text-sm md:text-base lg:text-lg" },
];

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: '1', title: 'First Conversation', date: 'May 5, 2023' },
    { id: '2', title: 'Travel Plans', date: 'May 10, 2023' },
    { id: '3', title: 'Project Ideas', date: 'May 15, 2023' },
  ]);
  const [activeConversation, setActiveConversation] = useState<string>('1');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [chatAttachment, setChatAttachment] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() || chatAttachment) {
      const newMessage: ChatMessage = {
        text: message || (chatAttachment ? `[Audio attached: ${chatAttachment.name}]` : ""),
        role: 'user',
      };

      if (chatAttachment) {
        newMessage.audioFile = {
          name: chatAttachment.name,
          url: URL.createObjectURL(chatAttachment)
        };
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Add an example response message
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          text: "I received your message!",
          role: 'assistant'
        };
        setMessages(prevMessages => [...prevMessages, responseMessage]);
      }, 1000);
      
      setMessage('');
      setChatAttachment(null);
    }
  };

  const createNewConversation = () => {
    const newId = (conversations.length + 1).toString();
    const newConversation = {
      id: newId,
      title: 'New Conversation',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setConversations([...conversations, newConversation]);
    setActiveConversation(newId);
    setMessages([]);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-900 text-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        conversations={conversations}
        activeConversation={activeConversation}
        createNewConversation={createNewConversation}
        setActiveConversation={setActiveConversation}
        toggleSidebar={toggleSidebar}
      />
      
      <main className="relative flex flex-1 flex-col transition-all duration-300 bg-gradient-to-b from-gray-900/30 to-black/60 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <ChatHeader 
            activeConversation={activeConversation} 
            conversations={conversations} 
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        </div>
        
        <div className={`flex-1 ${messages.length > 0 ? 'overflow-y-auto scrollbar-thin' : 'overflow-hidden'}`}>
          {messages.length === 0 ? (
            <WelcomeScreen 
              welcomeWords={welcomeWords}
            />
          ) : (
            <ChatMessages 
              messages={messages} 
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>
        
        <ChatInput 
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          chatAttachment={chatAttachment}
          setChatAttachment={setChatAttachment}
        />
      </main>
    </div>
  );
};

export default Chat;