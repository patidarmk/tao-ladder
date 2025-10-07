import { useState, useEffect, useRef, useCallback } from 'react';

const INITIAL_BPM = 100;
const BPM_INCREASE_PER_LEVEL = 10;
const INITIAL_LIVES = 3;
const RUNGS_PER_LEVEL = 10;
// The timing window will be a percentage of the beat interval
const INITIAL_TIMING_WINDOW_PERCENT = 0.3; // 30% of the beat interval
const TIMING_WINDOW_SHRINK_FACTOR = 0.95; // Shrinks by 5% each level

export interface GameState {
  score: number;
  combo: number;
  level: number;
  lives: number;
  rung: number;
  bpm: number;
  isPaused: boolean;
  isGameOver: boolean;
  isMuted: boolean;
  lastTapResult: 'perfect' | 'good' | 'miss' | null;
}

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 1,
    level: 1,
    lives: INITIAL_LIVES,
    rung: 0,
    bpm: INITIAL_BPM,
    isPaused: true,
    isGameOver: false,
    isMuted: true,
    lastTapResult: null,
  });

  const beatInterval = 60000 / gameState.bpm;
  const timingWindow = beatInterval * INITIAL_TIMING_WINDOW_PERCENT * Math.pow(TIMING_WINDOW_SHRINK_FACTOR, gameState.level - 1);

  const lastBeatTime = useRef<number>(0);
  const gameLoopRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);

  const playMetronome = useCallback(() => {
    if (gameState.isMuted || !audioContextRef.current) return;
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    gain.gain.setValueAtTime(1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.05);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.05);
  }, [gameState.isMuted]);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      combo: 1,
      level: 1,
      lives: INITIAL_LIVES,
      rung: 0,
      bpm: INITIAL_BPM,
      isPaused: true,
      isGameOver: false,
      isMuted: gameState.isMuted,
      lastTapResult: null,
    });
    lastBeatTime.current = performance.now();
  }, [gameState.isMuted]);

  const handleTap = useCallback(() => {
    if (gameState.isPaused || gameState.isGameOver) {
        if (gameState.isGameOver) resetGame();
        else setGameState(prev => ({ ...prev, isPaused: false }));
        return;
    }

    const now = performance.now();
    const timeSinceLastBeat = now - lastBeatTime.current;
    const timeToNextBeat = beatInterval - timeSinceLastBeat;
    const tapTimingError = Math.min(timeSinceLastBeat, timeToNextBeat);

    if (tapTimingError <= timingWindow / 2) { // Perfect hit
      const points = 10 * gameState.combo;
      const newRung = gameState.rung + 1;
      const newLevel = Math.floor(newRung / RUNGS_PER_LEVEL) + 1;
      const newBpm = INITIAL_BPM + (newLevel - 1) * BPM_INCREASE_PER_LEVEL;

      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        combo: prev.combo + 1,
        rung: newRung,
        level: newLevel,
        bpm: newBpm,
        lastTapResult: 'perfect',
      }));
    } else { // Miss
      setGameState(prev => ({
        ...prev,
        combo: 1,
        lives: Math.max(0, prev.lives - 1),
        rung: Math.max(0, prev.rung - 1),
        lastTapResult: 'miss',
      }));
      if (gameState.lives - 1 <= 0) {
        setGameState(prev => ({ ...prev, isGameOver: true, isPaused: true }));
      }
    }
  }, [gameState, beatInterval, timingWindow, resetGame]);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (!lastBeatTime.current) {
        lastBeatTime.current = timestamp;
      }

      if (!gameState.isPaused && timestamp - lastBeatTime.current >= beatInterval) {
        lastBeatTime.current = timestamp;
        playMetronome();
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (!gameState.isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPaused, beatInterval, playMetronome]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTap]);

  const togglePause = () => {
    if (gameState.isGameOver) return;
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const toggleMute = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setGameState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const getBeatProgress = () => {
      if(gameState.isPaused) return 0;
      return (performance.now() - lastBeatTime.current) / beatInterval;
  }

  return { gameState, handleTap, togglePause, toggleMute, resetGame, getBeatProgress, timingWindow, beatInterval };
};