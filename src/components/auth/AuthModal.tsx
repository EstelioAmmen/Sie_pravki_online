import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001]">
      <div className="bg-[#2C3035] rounded-xl p-6 w-[90%] max-w-[400px] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-white/90 mb-4 text-center">
          Для просмотра стоимости инвентаря необходимо авторизоваться
        </h3>
        <div className="flex justify-center">
          <button
            onClick={() => {
              onLogin();
              onClose();
            }}
            className="w-[140px] h-[48px] bg-[#3C73DD] hover:bg-[#4d82ec] transition-all duration-200 rounded-lg font-bold text-sm text-white/95 shadow-lg"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}