import React, { useEffect, useState, useRef } from 'react';
import Terminal from './Terminal';
import { animationFrames } from './animation-frames';

const FRAME_DURATION = 100; // milliseconds per frame

const AnimatedTerminal = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && animationFrames.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % animationFrames.length);
      }, FRAME_DURATION);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleTerminalClick = () => {
    setIsPlaying(!isPlaying);
  };

  if (!animationFrames || animationFrames.length === 0) {
    return (
      <Terminal
        content="Loading terminal animation..."
        onClick={handleTerminalClick}
      />
    );
  }

  const currentFrameData = animationFrames[currentFrame];

  return (
    <Terminal
      content={currentFrameData}
      onClick={handleTerminalClick}
      isPlaying={isPlaying}
    />
  );
};

export default AnimatedTerminal;
