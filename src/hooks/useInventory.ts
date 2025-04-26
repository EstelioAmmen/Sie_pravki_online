import {useState, useRef, useEffect} from 'react';
import { LoadingStep, User } from '@/types';
import { useSteam } from '@/contexts/SteamContext';

const initialLoadingSteps: LoadingStep[] = [
  { status: 'pending', message: 'Определяем ваш SteamID' },
  { status: 'pending', message: 'Отправляем запрос на получение предметов' },
  { status: 'pending', message: 'Добавляем цены к предметам' },
  { status: 'pending', message: 'Готово' }
];

export function useInventory() {
  const { setResolvedSteamId } = useSteam();
  const [selectedGame, setSelectedGame] = useState(730);
  const [showInventory, setShowInventory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(initialLoadingSteps);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  
  const checkButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setShowInventory(false);
  }, [selectedGame]);

  const updateStep = (index: number, status: LoadingStep['status'], errorMessage?: string) => {
    setLoadingSteps(steps => steps.map((step, i) => {
      if (i === index) {
        return { ...step, status, errorMessage };
      } else if (i > index) {
        return { ...step, status: 'pending' };
      }
      return step;
    }));
  };

  const handleInventoryCheck = async (user: User | null, profileUrl: string) => {
    if (!user) {
      return false;
    }

    setIsLoading(true);
    setShowLoadingModal(true);
    setLoadingSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));

    try {
      updateStep(0, 'loading');
      const steamidResponse = await fetch(
        `https://api.buff-163.ru/${selectedGame}/steamid?text=${encodeURIComponent(profileUrl)}`,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!steamidResponse.ok) {
        throw new Error('steamid');
      }

      const { steamid64 } = await steamidResponse.json();
      setResolvedSteamId(steamid64);
      updateStep(0, 'success');

      updateStep(1, 'loading');
      const inventoryResponse = await fetch(
        `https://api.buff-163.ru/inventory/${steamid64}/${selectedGame}`,
        {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!inventoryResponse.ok) {
        throw new Error('inventory');
      }

      await inventoryResponse.json();
      updateStep(1, 'success');

      updateStep(2, 'loading');
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateStep(2, 'success');

      updateStep(3, 'loading');
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStep(3, 'success');

      setTimeout(() => {
        setShowLoadingModal(false);
        setShowInventory(true);
      }, 1000);

      return true;
    } catch (error) {
      const errorType = (error as Error).message;
      
      if (errorType === 'steamid') {
        updateStep(0, 'error', 'Не удалось определить ссылку на ваш профиль, попробуйте позже, или напишите в Поддержку');
      } else if (errorType === 'inventory') {
        updateStep(1, 'error', 'Проверьте, не скрыт ли ваш инвентарь в настройках профиля, если инвентарь открыт и в нем есть предметы, напишите в Поддержку');
      } else {
        updateStep(2, 'error', 'Не удалось определить цены. Попробуйте ещё раз или напишите в Поддержку');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseLoadingModal = () => {
    setShowLoadingModal(false);
    setLoadingSteps(steps => steps.map(step => ({ ...step, status: 'pending' })));
    setIsLoading(false);
    checkButtonRef.current?.focus();
  };

  return {
    selectedGame,
    setSelectedGame,
    showInventory,
    isLoading,
    loadingSteps,
    showLoadingModal,
    checkButtonRef,
    handleInventoryCheck,
    handleCloseLoadingModal
  };
}