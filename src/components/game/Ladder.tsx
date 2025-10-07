import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { GameState } from '@/hooks/useGameEngine';

interface LadderProps {
  rung: number;
  lastTapResult: GameState['lastTapResult'];
}

const RUNG_COUNT = 15;
const RUNG_HEIGHT = 40; // in pixels

export const Ladder = ({ rung, lastTapResult }: LadderProps) => {
  const [displayResult, setDisplayResult] = useState<'perfect' | 'miss' | null>(null);

  useEffect(() => {
    if (lastTapResult) {
      setDisplayResult(lastTapResult === 'perfect' || lastTapResult === 'good' ? 'perfect' : 'miss');
      const timer = setTimeout(() => setDisplayResult(null), 300);
      return () => clearTimeout(timer);
    }
  }, [lastTapResult, rung]);

  const characterPosition = RUNG_COUNT - (rung % RUNG_COUNT) - 1;
  const ladderOffset = Math.floor(rung / RUNG_COUNT);

  return (
    <div className="relative w-48 h-[600px] mx-auto" style={{ height: RUNG_COUNT * RUNG_HEIGHT }}>
      {/* Ladder Rails */}
      <div className="absolute left-0 top-0 w-2 h-full bg-yellow-800 rounded" />
      <div className="absolute right-0 top-0 w-2 h-full bg-yellow-800 rounded" />

      {/* Ladder Rungs */}
      {Array.from({ length: RUNG_COUNT }).map((_, i) => (
        <div
          key={`rung-${ladderOffset}-${i}`}
          className="absolute left-2 right-2 h-1 bg-yellow-700"
          style={{ top: `${i * RUNG_HEIGHT + RUNG_HEIGHT / 2}px` }}
        />
      ))}

      {/* Character */}
      <div
        className="absolute w-10 h-10 transition-all duration-200 ease-out"
        style={{
          top: `${characterPosition * RUNG_HEIGHT}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className={cn(
          "w-10 h-10 text-3xl flex items-center justify-center transition-transform duration-300",
          displayResult === 'perfect' && 'animate-bounce',
          displayResult === 'miss' && 'animate-shake',
        )}>
          🧗
        </div>
      </div>
      
      {/* Hit/Miss Particles */}
      {displayResult && (
        <div className="absolute w-24 h-24" style={{
          top: `${characterPosition * RUNG_HEIGHT - 30}px`,
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          <span className={cn(
            "absolute text-2xl font-bold opacity-0 animate-ping-fade-out",
            displayResult === 'perfect' ? 'text-green-400' : 'text-red-500'
          )}>
            {displayResult === 'perfect' ? 'Nice!' : 'Miss!'}
          </span>
        </div>
      )}
    </div>
  );
};