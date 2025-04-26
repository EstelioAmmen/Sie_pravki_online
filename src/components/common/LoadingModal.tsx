import { useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';
import { LoadingStep } from '@/types';

interface LoadingModalProps {
  isOpen: boolean;
  steps: LoadingStep[];
  onClose: () => void;
}

export function LoadingModal({ isOpen, steps, onClose }: LoadingModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001]"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#2C3035] rounded-xl p-6 w-[90%] max-w-[500px] relative">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 text-white/50 hover:text-[#3C73DD] transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white/90 mb-6 text-center">
          Загружаем ваш инвентарь
        </h3>

        <div className="flex justify-center mb-6">
          <Loader2 size={48} className="text-[#3C73DD] animate-spin" />
        </div>

        <div className="space-y-4 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <p className={`text-sm ${
                step.status === 'loading' ? 'text-white' :
                step.status === 'success' ? 'text-[#3C73DD]' :
                step.status === 'error' ? 'text-[#FF4A4A]' :
                'text-white/50'
              }`}>
                {step.status === 'error' ? (
                  <span dangerouslySetInnerHTML={{ 
                    __html: step.errorMessage?.replace(
                      'Поддержку',
                      '<a href="https://t.me/MannCoSupplyCrateKey" target="_blank" rel="noopener" class="text-[#3C73DD] hover:underline">Поддержку</a>'
                    )?.replace(
                      'настройках профиля',
                      '<a href="https://steamcommunity.com/my/edit/settings" target="_blank" rel="noopener" class="text-[#3C73DD] hover:underline">настройках профиля</a>'
                    ) || ''
                  }} />
                ) : step.message}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-colors duration-300 ${
                step.status === 'success' ? 'bg-[#3C73DD]' :
                step.status === 'error' ? 'bg-[#FF4A4A]' :
                step.status === 'loading' ? 'bg-[#3C73DD] animate-pulse' :
                'bg-[#555555]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}