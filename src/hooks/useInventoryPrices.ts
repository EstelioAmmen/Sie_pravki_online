import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types';
import { useSteam } from '@/contexts/SteamContext';

interface UseInventoryResult {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
}

export function useInventoryPrices(
  defaultSteamId: string,
  selectedGame: number
): UseInventoryResult {
  const { resolvedSteamId } = useSteam();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steamId = resolvedSteamId || defaultSteamId;

  useEffect(() => {
    if (!steamId) return;

    setLoading(true);
    setError(null);

    const controller = new AbortController();

    fetch(`https://api.buff-163.ru/getjsoninv/${steamId}`, {
      credentials: 'include',
      signal: controller.signal
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data = await res.json();

        const items: InventoryItem[] = (Array.isArray(data) ? data : [])
          .filter((it: any) => Number(it.appid) === selectedGame)
          .map((it: any) => ({
            id: `${it.market_hash_name}-${it.appid}`,
            name: it.market_hash_name,
            image: `https://community.fastly.steamstatic.com/economy/image/${it.icon_url}/360fx240f`,
            basePrice: Number(it.prices?.RUB) || 0,
            marketPrice: Number(it.prices?.RUB) || 0,
            quantity: Number(it.count) || 1,
            inCart: false,
            source: 'steam',
            tradable: Boolean(it.tradable),
            marketable: Boolean(it.marketable),
            appId: Number(it.appid)
          }));

        setInventory(items);
      })
      .catch((err: any) => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('Не удалось загрузить инвентарь');
        }
        setInventory([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [steamId]);

  return { inventory, loading, error };
}