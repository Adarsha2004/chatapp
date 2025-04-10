import React from 'react';

interface CircleBeatProps {
  className?: string;
}

const CircleBeat: React.FC<CircleBeatProps> = ({ className = '' }) => {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="relative w-[600px] h-[600px]">
        <div className="absolute inset-0 animate-pulse-slow">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#459DDC]/40 to-purple-500/40 blur-[60px]" />
        </div>
        <div className="absolute inset-0 animate-pulse-slower">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#459DDC]/30 to-purple-500/30 blur-[120px]" />
        </div>
      </div>
    </div>
  );
};

export default CircleBeat;
