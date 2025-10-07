import { useEffect, useState, useRef } from 'react';

interface BeatIndicatorProps {
  getBeatProgress: () => number;
  isPaused: boolean;
  timingWindow: number;
  beatInterval: number;
}

export const BeatIndicator = ({ getBeatProgress, isPaused, timingWindow, beatInterval }: BeatIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setProgress(getBeatProgress());
      frameRef.current = requestAnimationFrame(animate);
    };

    if (!isPaused) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      setProgress(0);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPaused, getBeatProgress]);

  const timingWindowPercentage = (timingWindow / beatInterval) * 100;

  return (
    <div className="w-full max-w-md mx-auto h-8 bg-black/20 rounded-full overflow-hidden relative shadow-inner">
      <div 
        className="absolute top-0 bottom-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"
        style={{ 
          left: `${50 - timingWindowPercentage / 2}%`,
          right: `${50 - timingWindowPercentage / 2}%`,
        }}
      />
      <div
        className="h-full bg-white rounded-full"
        style={{ width: `${progress * 100}%` }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-white/50" />
    </div>
  );
};