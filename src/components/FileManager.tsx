import React from 'react';
import { ChatMessage, Conversation } from './CommonTypes';

interface FileManagerProps {
  onFileProcessed: (message: ChatMessage, conversation: Conversation) => void;
  onUploadStatusChange: (status: 'idle' | 'uploading' | 'success' | 'error') => void;
  onUploadProgressChange: (progress: number) => void;
  onUploadedFileChange: (file: File | null) => void;
  onAddToMySpace: (file: { name: string; url: string }) => void;
}

export const processAudioFile = (
  file: File,
  {
    onFileProcessed,
    onUploadStatusChange,
    onUploadProgressChange,
    onUploadedFileChange,
    onAddToMySpace
  }: FileManagerProps
) => {
  if (!file.type.startsWith('audio/')) {
    alert('Please upload an audio file');
    return;
  }

  onUploadedFileChange(file);
  onUploadStatusChange('uploading');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    onUploadProgressChange(progress);
    
    if (progress >= 100) {
      clearInterval(interval);
      const fileUrl = URL.createObjectURL(file);
      
      // Add to MySpace
      onAddToMySpace({ name: file.name, url: fileUrl });

      // Create new conversation and message
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: file.name,
        date: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })
      };

      const newMessage: ChatMessage = {
        text: "",
        role: 'user',
        audioFile: {
          name: file.name,
          url: fileUrl
        }
      };

      onFileProcessed(newMessage, newConversation);
      onUploadStatusChange('success');
      
      setTimeout(() => {
        onUploadStatusChange('idle');
        onUploadProgressChange(0);
        onUploadedFileChange(null);
      }, 300);
    }
  }, 100);
};

const FileManager: React.FC<FileManagerProps> = (props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudioFile(file, props);
    }
  };

  return (
    <input
      type="file"
      accept="audio/*"
      onChange={handleFileChange}
      style={{ display: 'none' }}
    />
  );
};

export default FileManager;
