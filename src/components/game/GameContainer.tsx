import { useGameEngine } from '@/hooks/useGameEngine';
import { HUD } from './HUD';
import { Ladder } from './Ladder';
import { BeatIndicator } from './BeatIndicator';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCw, Volume2, VolumeX } from 'lucide-react';

export const GameContainer = () => {
  const { gameState, handleTap, togglePause, toggleMute, resetGame, getBeatProgress, timingWindow, beatInterval } = useGameEngine();

  return (
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden select-none"
      onClick={handleTap}
    >
      <HUD gameState={gameState} />

      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <Ladder rung={gameState.rung} lastTapResult={gameState.lastTapResult} />
      </div>

      <div className="w-full max-w-md p-4 space-y-4">
        <BeatIndicator 
          getBeatProgress={getBeatProgress} 
          isPaused={gameState.isPaused}
          timingWindow={timingWindow}
          beatInterval={beatInterval}
        />
        <div className="flex justify-center items-center gap-4">
          <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); togglePause(); }}>
            {gameState.isPaused && !gameState.isGameOver ? <Play /> : <Pause />}
          </Button>
          <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); resetGame(); }}>
            <RotateCw />
          </Button>
          <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
            {gameState.isMuted ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>
      </div>

      {(gameState.isPaused || gameState.isGameOver) && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-white text-center p-4">
          {gameState.isGameOver ? (
            <>
              <h2 className="text-5xl font-bold mb-2">Game Over</h2>
              <p className="text-2xl mb-4">Final Score: {gameState.score}</p>
              <p className="text-lg opacity-80">Tap or press Space to play again</p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold mb-2">Tap Ladder</h2>
              <p className="text-lg opacity-80">Tap in time with the beat to climb.</p>
              <p className="text-lg opacity-80 mt-4">Tap or press Space to start</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};