import React, { useRef } from 'react';
import { TypewriterEffectSmooth } from './type-writer';
import { UploadCloud, Plus, Check, AlertCircle } from 'lucide-react';

interface WelcomeScreenProps {
  isDragging: boolean;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  uploadProgress: number;
  uploadedFile: File | null;
  handleAudioUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetUpload: () => void;
  welcomeWords: Array<{ text: string; className: string }>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isDragging,
  uploadStatus,
  uploadProgress,
  uploadedFile,
  handleAudioUpload,
  resetUpload,
  welcomeWords
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-center h-full relative">
      {isDragging && (
        <div className="absolute inset-0 border-2 border-[#459DDC] border-dashed rounded-lg bg-[#459DDC]/10 z-10 flex items-center justify-center">
          <div className="bg-gray-900/80 text-[#459DDC] py-2 md:py-3 px-4 md:px-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center text-base md:text-xl font-medium">
              <UploadCloud className="h-5 w-5 md:h-6 md:w-6 mr-2" />
              Drop your audio file here
            </div>
          </div>
        </div>
      )}
      <div className="text-center text-gray-400 max-w-xl w-full px-4 animate-fade-in flex flex-col items-center justify-center">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-medium mb-2 md:mb-3 animated-gradient-text welcome-title">Welcome to Memory Lane</h3>
        <div className="flex flex-wrap justify-center max-w-[280px] sm:max-w-full mx-auto">
          <TypewriterEffectSmooth 
            words={welcomeWords}
            className="text-gray-400 !mt-0 !my-0"
            cursorClassName="hidden"
          />
        </div>
        
        <div className="mt-8 md:mt-10 flex flex-col items-center welcome-upload">
          {uploadStatus === 'idle' ? (
            <div className="flex flex-col items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-transparent hover:bg-gray-800 text-gray-300 rounded-md border border-gray-700 py-1.5 md:py-2 px-3 md:px-4 flex items-center gap-2 transition-colors text-sm md:text-base"
              >
                <Plus className="h-4 w-4 md:h-5 md:w-5 text-[#459DDC]" />
                Upload audio file
              </button>
              <span className="text-[10px] md:text-xs text-gray-500 mt-1.5 md:mt-2">
                Supports MP3, WAV, M4A, FLAC
              </span>
            </div>
          ) : uploadStatus === 'uploading' ? (
            <div className="w-full max-w-md">
              <div className="mb-2 flex items-center bg-gray-800/30 py-1.5 md:py-2 px-2 md:px-3 rounded-md">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-gray-800 flex items-center justify-center mr-2">
                  <span className="text-[10px] md:text-xs text-gray-300 uppercase">
                    {uploadedFile?.name.split('.').pop() || 'mp3'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white text-xs md:text-sm truncate max-w-[150px] md:max-w-xs font-medium block" title={uploadedFile?.name}>{uploadedFile?.name}</span>
                  <div className="text-[10px] md:text-xs text-gray-400">
                    {uploadedFile ? (uploadedFile.size / 1024).toFixed(0) + ' KB' : ''}
                  </div>
                  <div className="mt-1.5 md:mt-2">
                    <div className="flex justify-between mb-1 text-[10px] md:text-sm">
                      <span className="text-white">Uploading...</span>
                      <span className="text-gray-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#459DDC] transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : uploadStatus === 'success' ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center text-green-500 bg-green-900/20 py-1.5 md:py-2 px-3 md:px-4 rounded-md mb-2 md:mb-3 text-sm md:text-base">
                <Check className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                <span>File uploaded successfully</span>
              </div>
              <button 
                onClick={resetUpload}
                className="text-gray-400 hover:text-[#459DDC] transition-colors text-xs md:text-sm"
              >
                Upload another file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center text-red-500 bg-red-900/20 py-1.5 md:py-2 px-3 md:px-4 rounded-md mb-2 md:mb-3 text-sm md:text-base">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                <span>Upload failed</span>
              </div>
              <button 
                onClick={resetUpload}
                className="text-gray-400 hover:text-[#459DDC] transition-colors text-xs md:text-sm"
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
          
          <div className="w-full mt-6 md:mt-8 border-t border-gray-800 pt-6 md:pt-8 flex flex-col items-center welcome-info">
            <div className="text-gray-500 text-xs md:text-sm max-w-md text-center">
              <p className="mb-2 md:mb-3">You can also drag and drop audio files anywhere on this screen</p>
              <p className="text-[10px] md:text-xs text-gray-600">Your files stay private and won't be shared with others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
