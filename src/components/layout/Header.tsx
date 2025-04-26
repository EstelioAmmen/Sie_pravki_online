import { Stamp as SteamIcon, LogOut } from 'lucide-react';
import { User } from '@/types';

interface HeaderProps {
  user: User;
  handleLogin: () => void;
  handleLogout: () => void;
}

export function Header({ user, handleLogin, handleLogout }: HeaderProps) {
  return (
    <header className="header-fixed h-20 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-bold tracking-wide text-white drop-shadow-sm">
          Steam Inventory
        </h1>
      </div>
      
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-white/90">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#FF4A4A] hover:bg-[#FF5C5C] transition-all duration-200 px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:scale-[1.02]"
          >
            <LogOut size={18} />
            ВЫЙТИ
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-[#3C73DD] hover:bg-[#4d82ec] transition-all duration-200 px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:scale-[1.02]"
        >
          <SteamIcon size={18} />
          ВОЙТИ ЧЕРЕЗ STEAM
        </button>
      )}
    </header>
  );
}