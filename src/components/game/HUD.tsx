import { Flame, Star, TrendingUp, Heart } from 'lucide-react';
import { GameState } from '@/hooks/useGameEngine';

interface HUDProps {
  gameState: GameState;
}

const HUDStat = ({ icon, value, label, className }: { icon: React.ReactNode, value: string | number, label: string, className?: string }) => (
  <div className={`flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-2 px-4 rounded-lg ${className}`}>
    {icon}
    <div className="text-left">
      <p className="text-xl font-bold leading-none">{value}</p>
      <p className="text-xs uppercase opacity-70 leading-none">{label}</p>
    </div>
  </div>
);

export const HUD = ({ gameState }: HUDProps) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center text-white font-mono">
      <div className="flex items-center gap-2">
        <HUDStat icon={<Star className="w-6 h-6 text-yellow-300" />} value={gameState.score} label="Score" />
        <HUDStat icon={<Flame className="w-6 h-6 text-orange-400" />} value={`x${gameState.combo}`} label="Combo" />
      </div>
      <div className="flex items-center gap-2">
        <HUDStat icon={<TrendingUp className="w-6 h-6 text-green-300" />} value={gameState.level} label="Level" />
        <HUDStat icon={<Heart className="w-6 h-6 text-red-400 fill-current" />} value={gameState.lives} label="Lives" />
      </div>
    </div>
  );
};