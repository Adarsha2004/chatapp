import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
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
      
      <div className="flex items-center gap-1 sm:gap-2 w-full">
        <button
          onClick={togglePlay}
          className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-[#459DDC] hover:bg-[#459DDC]/90 text-white transition-colors ${isPlaying ? '' : 'play-btn-pulse'}`}
        >
          {isPlaying ? 
            <Pause className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" /> : 
            <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          }
        </button>
        
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
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

export default AudioPlayer;
