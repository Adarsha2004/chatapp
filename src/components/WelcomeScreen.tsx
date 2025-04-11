import React from 'react';
import { TypewriterEffectSmooth } from './type-writer';

interface WelcomeScreenProps {
  welcomeWords: Array<{ text: string; className: string }>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  welcomeWords
}) => {
  return (
    <div className="flex items-center justify-center h-full relative">
      <div className="text-center text-gray-400 max-w-xl w-full px-4 animate-fade-in flex flex-col items-center justify-center">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-medium mb-2 md:mb-3 animated-gradient-text welcome-title">Welcome to Memory Lane</h3>
        <div className="flex flex-wrap justify-center max-w-[280px] sm:max-w-full mx-auto">
          <TypewriterEffectSmooth 
            words={welcomeWords}
            className="text-gray-400 !mt-0 !my-0"
            cursorClassName="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
