import React, { useEffect, useRef, useState } from 'react';
import Terminal from './terminal'; // Adjust path as needed

// AnimationManager class for handling terminal animation timing
class AnimationManager {
  constructor(callback) {
    this._animation = null;
    this.callback = callback;
    this.lastFrame = -1;
    this.frameTime = 1000 / 30; // 30fps
  }

  start() {
    if (this._animation) return;

    const animate = () => {
      const currentFrame = Math.floor(Date.now() / this.frameTime);
      if (currentFrame !== this.lastFrame) {
        this.lastFrame = currentFrame;
        this.callback();
      }
      this._animation = requestAnimationFrame(animate);
    };

    this._animation = requestAnimationFrame(animate);
  }

  stop() {
    if (this._animation) {
      cancelAnimationFrame(this._animation);
      this._animation = null;
    }
  }

  destroy() {
    this.stop();
    this.callback = null;
  }
}

// AnimatedTerminal component with debug logging
export default function AnimatedTerminal({
  frames = [],
  frameLengthMs = 33, // ~30fps
  columns = 80,
  rows = 24,
  fontSize = "medium",
  title = "Terminal",
  className,
  whitespacePadding = 0,
  loop = true,
  autoStart = true,
}) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const animationManagerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('AnimatedTerminal: Props received:', {
      framesLength: frames.length,
      frameLengthMs,
      autoStart,
      loop,
      isPlaying,
      currentFrameIndex
    });

    if (frames.length > 0) {
      console.log('First frame preview:', frames[0]?.substring(0, 100) + '...');
    }
  }, [frames, frameLengthMs, autoStart, loop, isPlaying, currentFrameIndex]);

  // Initialize animation manager
  useEffect(() => {
    console.log('AnimatedTerminal: Setting up animation manager');

    const updateFrame = () => {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        console.log('AnimatedTerminal: Animation started at', startTimeRef.current);
      }

      const elapsed = Date.now() - startTimeRef.current;
      const frameIndex = Math.floor(elapsed / frameLengthMs);

      console.log('AnimatedTerminal: Update frame - elapsed:', elapsed, 'frameIndex:', frameIndex, 'totalFrames:', frames.length);

      if (frameIndex < frames.length) {
        setCurrentFrameIndex(frameIndex);
      } else if (loop && frames.length > 0) {
        // Reset animation for loop
        console.log('AnimatedTerminal: Looping animation');
        startTimeRef.current = Date.now();
        setCurrentFrameIndex(0);
      } else {
        // Animation finished
        console.log('AnimatedTerminal: Animation finished');
        setIsPlaying(false);
      }
    };

    animationManagerRef.current = new AnimationManager(updateFrame);

    return () => {
      console.log('AnimatedTerminal: Cleaning up animation manager');
      if (animationManagerRef.current) {
        animationManagerRef.current.destroy();
      }
    };
  }, [frames.length, frameLengthMs, loop]);

  // Control animation playback
  useEffect(() => {
    console.log('AnimatedTerminal: Playback control effect - isPlaying:', isPlaying, 'framesLength:', frames.length);

    if (!animationManagerRef.current || frames.length === 0) {
      console.log('AnimatedTerminal: No animation manager or no frames');
      return;
    }

    if (isPlaying) {
      console.log('AnimatedTerminal: Starting animation');
      animationManagerRef.current.start();
    } else {
      console.log('AnimatedTerminal: Stopping animation');
      animationManagerRef.current.stop();
    }

    return () => {
      if (animationManagerRef.current) {
        animationManagerRef.current.stop();
      }
    };
  }, [isPlaying, frames.length]);

  // Reset when frames change
  useEffect(() => {
    console.log('AnimatedTerminal: Frames changed, resetting');
    setCurrentFrameIndex(0);
    startTimeRef.current = null;
    if (autoStart && frames.length > 0) {
      console.log('AnimatedTerminal: Auto-starting animation');
      setIsPlaying(true);
    }
  }, [frames, autoStart]);

  // Get current frame content
  const getCurrentLines = () => {
    if (!frames || frames.length === 0) {
      console.log('AnimatedTerminal: No frames available');
      return [];
    }

    const currentFrame = frames[currentFrameIndex] || '';
    const lines = currentFrame.split('\n');

    console.log('AnimatedTerminal: Current frame', currentFrameIndex, 'lines:', lines.length);

    return lines;
  };

  // Control functions (optional - you can expose these if needed)
  const play = () => {
    console.log('AnimatedTerminal: Play called');
    setIsPlaying(true);
  };

  const pause = () => {
    console.log('AnimatedTerminal: Pause called');
    setIsPlaying(false);
  };

  const reset = () => {
    console.log('AnimatedTerminal: Reset called');
    setCurrentFrameIndex(0);
    startTimeRef.current = null;
  };

  const currentLines = getCurrentLines();

  return (
    <div>
      {/* Debug info */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        marginBottom: '10px',
        fontFamily: 'monospace',
        background: '#f0f0f0',
        padding: '5px',
        borderRadius: '3px'
      }}>
        Debug: Frames: {frames.length} | Current: {currentFrameIndex} | Playing: {isPlaying ? 'Yes' : 'No'} | Lines: {currentLines.length}
      </div>

      <Terminal
        columns={columns}
        rows={rows}
        fontSize={fontSize}
        title={title}
        className={className}
        lines={currentLines}
        whitespacePadding={whitespacePadding}
        disableScrolling={true} // Usually want to disable scrolling for animations
      />
    </div>
  );
}

// Alternative simpler version for testing
export function SimpleAnimatedTerminal({
  frames = [],
  frameLengthMs = 100,
  columns = 80,
  rows = 24,
  fontSize = "medium",
  title = "Terminal",
  className,
  whitespacePadding = 0,
  loop = true,
}) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Debug logging for simple version
  useEffect(() => {
    console.log('SimpleAnimatedTerminal: Setup with', frames.length, 'frames');
  }, [frames]);

  useEffect(() => {
    if (frames.length === 0) {
      console.log('SimpleAnimatedTerminal: No frames to animate');
      return;
    }

    console.log('SimpleAnimatedTerminal: Starting interval animation');

    const interval = setInterval(() => {
      setCurrentFrameIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= frames.length) {
          const newIndex = loop ? 0 : prevIndex;
          console.log('SimpleAnimatedTerminal: End of frames, loop:', loop, 'newIndex:', newIndex);
          return newIndex;
        }
        console.log('SimpleAnimatedTerminal: Next frame index:', nextIndex);
        return nextIndex;
      });
    }, frameLengthMs);

    return () => {
      console.log('SimpleAnimatedTerminal: Cleaning up interval');
      clearInterval(interval);
    };
  }, [frames.length, frameLengthMs, loop]);

  const getCurrentLines = () => {
    if (!frames || frames.length === 0) return [];
    const currentFrame = frames[currentFrameIndex] || '';
    return currentFrame.split('\n');
  };

  const currentLines = getCurrentLines();

  return (
    <div>
      {/* Debug info */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        marginBottom: '10px',
        fontFamily: 'monospace',
        background: '#f0f0f0',
        padding: '5px',
        borderRadius: '3px'
      }}>
        Simple Debug: Frames: {frames.length} | Current: {currentFrameIndex} | Lines: {currentLines.length}
      </div>

      <Terminal
        columns={columns}
        rows={rows}
        fontSize={fontSize}
        title={title}
        className={className}
        lines={currentLines}
        whitespacePadding={whitespacePadding}
        disableScrolling={true}
      />
    </div>
  );
}
