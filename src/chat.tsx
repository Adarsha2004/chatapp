   // src/Chat.tsx
   import React, { useState, useEffect, useRef } from 'react';
   import io from 'socket.io-client';
   import { TypewriterEffectSmooth } from './components/type-writer';
   import { 
     Plus, 
     Search, 
     Settings, 
     Play, 
     Pause,
     UploadCloud,
     Check,
     AlertCircle,
     ArrowRight,
     Volume2,
     XCircle,
     ChevronRight
   } from 'lucide-react';

   const socket = io('http://localhost:3001'); // Connect to the server

   interface ChatMessage {
     text: string;
     role: 'user' | 'assistant';
     audioFile?: {
       name: string;
       url: string;  // In a real app, this would be the URL to the audio file
     };
   }

   interface Conversation {
     id: string;
     title: string;
     date: string;
   }


   const welcomeWords = [
     { text: "Upload", className: "text-lg md:text-xl lg:text-2xl" },
     { text: "search", className: "text-lg md:text-xl lg:text-2xl" },
     { text: "and chat", className: "text-lg md:text-xl lg:text-2xl" },
     { text: "with your", className: "text-lg md:text-xl lg:text-2xl" },
     { text: "audio", className: "text-lg md:text-xl lg:text-2xl text-[#459DDC]" },
     { text: "files.", className: "text-lg md:text-xl lg:text-2xl" },
   ];

   // Add this new component for the audio player
   const AudioPlayer: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
     const [isPlaying, setIsPlaying] = useState(false);
     const [currentTime, setCurrentTime] = useState(0);
     const [duration, setDuration] = useState(0);
     const audioRef = useRef<HTMLAudioElement>(null);

     const togglePlay = () => {
       if (audioRef.current) {
         if (isPlaying) {
           audioRef.current.pause();
         } else {
           audioRef.current.play();
         }
         setIsPlaying(!isPlaying);
       }
     };

     const handleTimeUpdate = () => {
       if (audioRef.current) {
         setCurrentTime(audioRef.current.currentTime);
       }
     };

     const handleLoadedMetadata = () => {
       if (audioRef.current) {
         setDuration(audioRef.current.duration);
       }
     };

     const handleEnded = () => {
       setIsPlaying(false);
       setCurrentTime(0);
       if (audioRef.current) {
         audioRef.current.currentTime = 0;
       }
     };

     const formatTime = (time: number) => {
       const minutes = Math.floor(time / 60);
       const seconds = Math.floor(time % 60);
       return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
     };

     const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
       const seekTime = parseFloat(e.target.value);
       setCurrentTime(seekTime);
       if (audioRef.current) {
         audioRef.current.currentTime = seekTime;
       }
     };

     return (
       <div className="flex flex-col w-full">
         <audio 
           ref={audioRef}
           src={audioUrl}
           className="hidden"
           onTimeUpdate={handleTimeUpdate}
           onLoadedMetadata={handleLoadedMetadata}
           onEnded={handleEnded}
         />
         
         <div className="flex items-center gap-2 w-full">
           <button
             onClick={togglePlay}
             className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#459DDC] hover:bg-[#459DDC]/90 text-white transition-colors ${isPlaying ? '' : 'play-btn-pulse'}`}
           >
             {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
           </button>
           
           <div className="flex-1 flex flex-col">
             <div className="flex justify-between text-xs text-gray-400 mb-1">
               <span>{formatTime(currentTime)}</span>
               <span>{formatTime(duration)}</span>
             </div>
             <input
               type="range"
               min="0"
               max={duration || 0}
               value={currentTime}
               onChange={handleSeek}
               className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#459DDC]"
               style={{
                 backgroundSize: `${(currentTime / (duration || 1)) * 100}% 100%`
               }}
             />
           </div>
         </div>
       </div>
     );
   };

   const Chat: React.FC = () => {
     const [message, setMessage] = useState<string>('');
     const [messages, setMessages] = useState<ChatMessage[]>([]);
     const [conversations, setConversations] = useState<Conversation[]>([
       { id: '1', title: 'First Conversation', date: 'May 5, 2023' },
       { id: '2', title: 'Travel Plans', date: 'May 10, 2023' },
       { id: '3', title: 'Project Ideas', date: 'May 15, 2023' },
     ]);
     const [activeConversation, setActiveConversation] = useState<string>('1');
     const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
     const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
     const [uploadProgress, setUploadProgress] = useState<number>(0);
     const [uploadedFile, setUploadedFile] = useState<File | null>(null);
     const [isDragging, setIsDragging] = useState<boolean>(false);
     const [chatAttachment, setChatAttachment] = useState<File | null>(null);
     const messagesEndRef = useRef<HTMLDivElement>(null);
     const fileInputRef = useRef<HTMLInputElement>(null);
     const chatFileInputRef = useRef<HTMLInputElement>(null);
     const welcomeScreenRef = useRef<HTMLDivElement>(null);

     const scrollToBottom = () => {
       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
     };

     useEffect(() => {
       if (messages.length > 0) {
         scrollToBottom();
       }
     }, [messages]);
     
     useEffect(() => {
       socket.on('message', (msg: string) => {
         // Messages from server are received as assistant messages
         setMessages((prevMessages) => [...prevMessages, { text: msg, role: 'assistant' }]);
       });

       return () => {
         socket.off('message');
       };
     }, []);

     const processAudioFile = (file: File) => {
       // Check if file is audio
       if (!file.type.startsWith('audio/')) {
         alert('Please upload an audio file');
         return;
       }
       
       setUploadedFile(file);
       setUploadStatus('uploading');
       
       // Simulate upload progress
       let progress = 0;
       const interval = setInterval(() => {
         progress += 10;
         setUploadProgress(progress);
         if (progress >= 100) {
           clearInterval(interval);
           setUploadStatus('success');
           
           // Create a new conversation with the filename
           const newId = (conversations.length + 1).toString();
           const newConversation = {
             id: newId,
             title: file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name,
             date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
           };
           setConversations([...conversations, newConversation]);
           setActiveConversation(newId);
           
           // Add welcome message from assistant
           setTimeout(() => {
             setMessages([{
               text: `I've processed your audio file "${file.name}". What would you like to know about it?`,
               role: 'assistant',
               audioFile: {
                 name: file.name,
                 url: URL.createObjectURL(file) // Create a URL for the audio file
               }
             }]);
           }, 1000);
         }
       }, 300);
     };

     useEffect(() => {
       // Add global drag and drop handlers when the messages are empty (welcome screen)
       if (messages.length === 0 && welcomeScreenRef.current) {
         const welcomeScreen = welcomeScreenRef.current;
         
         const handleGlobalDragOver = (e: DragEvent) => {
           e.preventDefault();
           e.stopPropagation();
           if (!isDragging) setIsDragging(true);
         };
         
         const handleGlobalDragLeave = (e: DragEvent) => {
           e.preventDefault();
           e.stopPropagation();
           
           // Only set isDragging to false if we're leaving the welcome screen
           // and not just moving between its children
           if (e.relatedTarget === null || !welcomeScreen.contains(e.relatedTarget as Node)) {
             setIsDragging(false);
           }
         };
         
         const handleGlobalDrop = (e: DragEvent) => {
           e.preventDefault();
           e.stopPropagation();
           setIsDragging(false);
           
           const files = e.dataTransfer?.files;
           if (files?.length) {
             processAudioFile(files[0]);
           }
         };
         
         welcomeScreen.addEventListener('dragover', handleGlobalDragOver);
         welcomeScreen.addEventListener('dragleave', handleGlobalDragLeave);
         welcomeScreen.addEventListener('drop', handleGlobalDrop);
         
         return () => {
           welcomeScreen.removeEventListener('dragover', handleGlobalDragOver);
           welcomeScreen.removeEventListener('dragleave', handleGlobalDragLeave);
           welcomeScreen.removeEventListener('drop', handleGlobalDrop);
         };
       }
     }, [messages.length, isDragging]);

     const sendMessage = () => {
       if (message.trim() || chatAttachment) {
         const newMessage: ChatMessage = {
           text: message || (chatAttachment ? `[Audio attached: ${chatAttachment.name}]` : ""),
           role: 'user',
         };
         
         // If there's an audio attachment, add it to the message
         if (chatAttachment) {
           newMessage.audioFile = {
             name: chatAttachment.name,
             url: URL.createObjectURL(chatAttachment)
           };
         }
         
         // Add your own message
         setMessages((prevMessages) => [...prevMessages, newMessage]);
         
         // Send message to server
         socket.emit('message', message || "Audio file attached");
         
         // Clear input
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

     const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (!file) return;
       processAudioFile(file);
     };
     
     
     const resetUpload = () => {
       setUploadStatus('idle');
       setUploadProgress(0);
       setUploadedFile(null);
       if (fileInputRef.current) {
         fileInputRef.current.value = '';
       }
     };

     const handleChatAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (!file) return;
       
       // Check if file is audio
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
       <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black">
         
         {/* History Sidebar */}
         <div 
           className={`fixed md:static h-full bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white flex flex-col shadow-xl rounded-r-xl border-r border-gray-800/40
             transition-all duration-300 ease-in-out transform z-20
             ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
         >
           <div className={`p-3 border-b border-gray-800/40 flex items-center ${!sidebarOpen && 'md:justify-center'}`}>
             <h2 className={`text-lg font-medium ${!sidebarOpen && 'md:hidden'} animated-gradient-text`}>Memory Lane</h2>
             {!sidebarOpen && (
               <ChevronRight className="hidden md:block h-6 w-6 text-[#459DDC]" />
             )}
           </div>
           <div className={`p-3 ${!sidebarOpen && 'md:px-2'}`}>
             <button 
               className={`w-full bg-[#459DDC] hover:bg-[#459DDC]/90 text-white font-medium py-2 rounded-xl
                 transition-all duration-200 flex items-center justify-center
                 ${!sidebarOpen && 'md:p-2'}`}
               onClick={createNewConversation}
             >
               {sidebarOpen || !sidebarOpen && window.innerWidth < 768 ? (
                 <span className="text-white">New Conversation</span>
               ) : (
                 <Plus className="h-6 w-6" />
               )}
             </button>
             
             {/* Search Box - Only visible when sidebar is open */}
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
           
           {/* Search button when sidebar is collapsed */}
           {!sidebarOpen && (
             <div className="p-3 md:px-2">
               <button 
                 className="w-full bg-gray-800 hover:bg-gray-700 text-[#459DDC] py-2 rounded-xl
                   transition-all duration-200 flex items-center justify-center md:p-2"
                 onClick={() => {/* Add search functionality */}}
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

         {/* Overlay */}
         {sidebarOpen && (
           <div 
             className="md:hidden fixed inset-0 z-0 bg-black bg-opacity-50 transition-opacity"
             onClick={toggleSidebar}
           ></div>
         )}

         {/* Chat Area */}
         <div className="flex-1 flex flex-col transition-all duration-300 relative bg-gradient-to-b from-gray-900/30 to-black/60 backdrop-blur-sm">
           {/* Header */}
           <div className="py-3 px-4 bg-transparent backdrop-blur-sm flex items-center sticky top-0 z-10 shadow-sm">
             <button 
               onClick={toggleSidebar}
               className="p-2 rounded-full hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#459DDC]"
               aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
             >
               {sidebarOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#459DDC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panel-right-open-icon lucide-panel-right-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#459DDC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-panel-right-icon lucide-panel-right"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></svg>
               )}
             </button>
             <h1 className="text-xl font-semibold flex-1 text-center pr-6 animated-gradient-text">
               {conversations.find(c => c.id === activeConversation)?.title || 'Memory Lane'}
             </h1>
           </div>
           
           {/* Chat Messages */}
           <div className={`flex-1 p-4 space-y-4 scrollbar-hide ${messages.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'}`}>
             {messages.length === 0 ? (
               <div 
                 className="flex items-center justify-center h-full relative"
                 ref={welcomeScreenRef}
               >
                 {isDragging && (
                   <div className="absolute inset-0 border-2 border-[#459DDC] border-dashed rounded-lg bg-[#459DDC]/10 z-10 flex items-center justify-center">
                     <div className="bg-gray-900/80 text-[#459DDC] py-3 px-6 rounded-lg backdrop-blur-sm">
                       <div className="flex items-center text-xl font-medium">
                         <UploadCloud className="h-6 w-6 mr-2" />
                         Drop your audio file here
                       </div>
                     </div>
                   </div>
                 )}
                 <div className="text-center text-gray-400 max-w-xl w-full px-4 animate-fade-in">
                   <h3 className="text-3xl font-medium mb-4 animated-gradient-text welcome-title">Welcome to Memory Lane</h3>
                   <TypewriterEffectSmooth 
                     words={welcomeWords}
                     className="text-gray-400 text-lg md:text-xl lg:text-2xl !mt-0 !my-0"
                     cursorClassName="hidden"
                   />
                   
                   <div className="mt-10 flex flex-col items-center welcome-upload">
                     {uploadStatus === 'idle' ? (
                       <div className="flex flex-col items-center">
                         <button
                           onClick={() => fileInputRef.current?.click()}
                           className="bg-transparent hover:bg-gray-800 text-gray-300 rounded-md border border-gray-700 py-2 px-4 flex items-center gap-2 transition-colors"
                         >
                           <Plus className="h-5 w-5 text-[#459DDC]" />
                           Upload audio file
                         </button>
                         <span className="text-xs text-gray-500 mt-2">
                           Supports MP3, WAV, M4A, FLAC
                         </span>
                       </div>
                     ) : uploadStatus === 'uploading' ? (
                       <div className="w-full max-w-md">
                         <div className="flex justify-between mb-1 text-sm">
                           <span className="text-[#459DDC]">Uploading...</span>
                           <span className="text-gray-400">{uploadProgress}%</span>
                         </div>
                         <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-[#459DDC] transition-all duration-300" 
                             style={{ width: `${uploadProgress}%` }} 
                           />
                         </div>
                         <div className="text-gray-500 text-xs mt-1 truncate">
                           {uploadedFile?.name}
                         </div>
                       </div>
                     ) : uploadStatus === 'success' ? (
                       <div className="flex flex-col items-center">
                         <div className="flex items-center text-green-500 bg-green-900/20 py-2 px-4 rounded-md mb-3">
                           <Check className="h-5 w-5 mr-2" />
                           <span>File uploaded successfully</span>
                         </div>
                         <button 
                           onClick={resetUpload}
                           className="text-gray-400 hover:text-[#459DDC] transition-colors text-sm"
                         >
                           Upload another file
                         </button>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center">
                         <div className="flex items-center text-red-500 bg-red-900/20 py-2 px-4 rounded-md mb-3">
                           <AlertCircle className="h-5 w-5 mr-2" />
                           <span>Upload failed</span>
                         </div>
                         <button 
                           onClick={resetUpload}
                           className="text-gray-400 hover:text-[#459DDC] transition-colors text-sm"
                         >
                           Try again
                         </button>
                       </div>
                     )}
                     
                     <input 
                       id="audio-upload" 
                       type="file" 
                       ref={fileInputRef}
                       accept="audio/*" 
                       className="hidden" 
                       onChange={handleAudioUpload}
                     />
                     
                     <div className="w-full mt-8 border-t border-gray-800 pt-8 flex flex-col items-center welcome-info">
                       <div className="text-gray-500 text-sm max-w-md text-center">
                         <p className="mb-3">You can also drag and drop audio files anywhere on this screen</p>
                         <p className="text-xs text-gray-600">Your files stay private and won't be shared with others</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             ) : (
               messages.map((msg, index) => (
                 <div 
                   key={index} 
                   className={`flex p-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}
                 >
                   <div 
                     className={`p-3 max-w-md shadow-lg ${
                       msg.role === 'user' 
                         ? 'bg-gradient-to-r from-[#459DDC] to-[#3A7DB5] text-white ml-auto rounded-2xl rounded-tr-sm' 
                         : 'glassmorphism text-[#459DDC]/90 rounded-2xl rounded-tl-sm'
                     }`}
                   >
                     {msg.text}
                     
                     {/* Audio Player */}
                     {msg.audioFile && (
                       <div className="mt-3 pt-3 border-t border-gray-700/30">
                         <div className="flex items-center gap-2">
                           <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                             <span className="text-xs text-gray-300 uppercase">
                               {msg.audioFile.name.split('.').pop() || 'MP3'}
                             </span>
                           </div>
                           <div className="flex-1">
                             <div className="text-sm flex flex-col">
                               <span className="text-[#459DDC] truncate font-medium">{msg.audioFile.name}</span>
                               <div className="mt-2 w-full">
                                 <AudioPlayer audioUrl={msg.audioFile.url} />
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               ))
             )}
             <div ref={messagesEndRef} />
           </div>
           
           {/* Input Area */}
           <div className="bg-transparent backdrop-blur-sm">
             <div className="max-w-4xl mx-auto flex flex-col p-4">
               {/* Audio attachment preview */}
               {chatAttachment && (
                 <div className="mb-2 ml-4 flex items-center bg-gray-800/30 py-2 px-3 rounded-md max-w-fit">
                   <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center mr-2">
                     <span className="text-xs text-gray-300 uppercase">
                       {chatAttachment.name.split('.').pop() || 'mp3'}
                     </span>
                   </div>
                   <div className="flex-1">
                     <span className="text-[#459DDC] text-sm truncate max-w-xs font-medium">{chatAttachment.name}</span>
                     <div className="text-xs text-gray-400">
                       {(chatAttachment.size / 1024).toFixed(0)} KB
                     </div>
                   </div>
                   <button 
                     onClick={removeChatAttachment}
                     className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
                   >
                     <XCircle className="h-4 w-4" />
                   </button>
                 </div>
               )}
               
               <div className="flex w-full rounded-full shadow-md bg-gray-800/10 backdrop-blur-sm overflow-hidden">
                 <div className="flex items-center px-3">
                   <button
                     onClick={() => chatFileInputRef.current?.click()}
                     className="text-gray-400 hover:text-[#459DDC] transition-all duration-300 p-1.5 hover:scale-110"
                     title="Attach audio file"
                   >
                     <Volume2 className="h-5 w-5" />
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
                   className="flex-1 p-3 px-4 bg-transparent text-white focus:outline-none focus:ring-0 shadow-inner transition-all duration-200"
                   placeholder={chatAttachment ? "Add a message about this audio file..." : "Type a message..."}
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                 />

                 <button
                   onClick={sendMessage}
                   disabled={!message.trim() && !chatAttachment}
                   className={`px-5 py-3 transition-all duration-200 ${
                     !message.trim() && !chatAttachment
                       ? 'bg-transparent text-gray-500'
                       : 'bg-[#459DDC] text-white hover:bg-[#459DDC]/90 hover:shadow-lg btn-pulse'
                   }`}
                 >
                   <span className="flex items-center">
                     <ArrowRight className="h-5 w-5" />
                   </span>
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
     );
   };

   export default Chat;