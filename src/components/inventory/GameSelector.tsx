import { games } from '@/constants/games';

interface GameSelectorProps {
  selectedGame: number;
  onSelect: (gameId: number) => void;
}

export function GameSelector({ selectedGame, onSelect }: GameSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {games.map((game) => (
        <button
          key={game.id}
          onClick={() => onSelect(game.id)}
          className={`w-[60px] h-[60px] rounded-lg flex items-center justify-center transition-all duration-200 ${
            selectedGame === game.id
              ? 'bg-[#3C73DD]/20 border-2 border-[#3C73DD]'
              : 'bg-[#2C3035] border-2 border-transparent hover:border-[#3C73DD]/50'
          }`}
        >
          <span className="text-sm font-bold text-white/90">{game.name}</span>
        </button>
      ))}
    </div>
  );
}