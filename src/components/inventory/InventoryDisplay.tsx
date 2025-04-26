import { useState } from 'react';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { LoadingModal } from '@/components/common/LoadingModal';
import { Currency } from '@/types';
import { useInventoryPrices } from '@/hooks/useInventoryPrices';
import { sourceOptions, tradabilityOptions, categoryOptions, sortOptions } from '@/constants/filterOptions';

interface InventoryDisplayProps {
  steamId: string;
  selectedGame: number;
  currency: Currency;
  onToggleCart: (id: string) => void;
}

export function InventoryDisplay({ steamId, selectedGame, currency, onToggleCart }: InventoryDisplayProps) {
  const { inventory, loading, error } = useInventoryPrices(steamId, selectedGame);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedTradability, setSelectedTradability] = useState('trade');
  const [selectedCategory, setSelectedCategory] = useState('marketrable');
  const [selectedFilter, setSelectedFilter] = useState('price-desc');

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (loading) {
    return (
      <LoadingModal
        isOpen={true}
        steps={[
          { status: 'loading', message: 'Добавляем цены к предметам' }
        ]}
        onClose={() => {}}
      />
    );
  }

  if (error || !inventory || inventory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle size={48} className="text-white/50 mb-4" />
        <p className="text-white/70 text-center">
          {error || 'Инвентарь пуст или не удалось загрузить предметы для выбранной игры.'}
        </p>
      </div>
    );
  }

  // Create a Map to store unique items by their ID
  const uniqueItems = new Map();
  inventory.forEach(item => {
    if (!uniqueItems.has(item.id)) {
      uniqueItems.set(item.id, item);
    }
  });

  // Convert Map back to array and apply filters
  const filteredItems = Array.from(uniqueItems.values()).filter(item => {
    if (selectedSource !== 'all' && item.source !== selectedSource) return false;
    if (selectedTradability !== 'all' && item.tradable !== (selectedTradability === 'trade')) return false;
    if (selectedCategory !== 'all' && item.marketable !== (selectedCategory === 'marketrable')) return false;
    return true;
  });

  // Sort the filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (selectedFilter) {
      case 'price-asc':
        return a.marketPrice - b.marketPrice;
      case 'price-desc':
        return b.marketPrice - a.marketPrice;
      case 'quantity-asc':
        return (a.quantity || 1) - (b.quantity || 1);
      case 'quantity-desc':
        return (b.quantity || 1) - (a.quantity || 1);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const totalItems = filteredItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalValue = filteredItems.reduce((sum, item) => sum + (item.marketPrice * (item.quantity || 1)), 0);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Ваш инвентарь
          </h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-white/70">
              Всего предметов: <span className="text-white font-medium">{totalItems}</span>
            </p>
            <p className="text-sm text-white/70">
              Общая стоимость: <span className="text-[#06FF4C] font-medium">{currency.symbol} {totalValue.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FilterDropdown
            options={sourceOptions}
            value={selectedSource}
            onChange={setSelectedSource}
            label="Источник"
          />

          <FilterDropdown
            options={tradabilityOptions}
            value={selectedTradability}
            onChange={setSelectedTradability}
            label="Обмен"
          />

          <FilterDropdown
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            label="Категория"
          />

          <FilterDropdown
            options={sortOptions}
            value={selectedFilter}
            onChange={setSelectedFilter}
            label="Сортировка"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            data-item-id={item.id}
            data-item-json={JSON.stringify(item)}
            className={`bg-[#2C3035] rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
              item.marketPrice === 0 ? 'opacity-50' : ''
            }`}
            title={item.marketPrice === 0 ? 'Не удалось определить цену.' : undefined}
          >
            <div className="relative h-[160px] bg-gradient-to-b from-[#1a1d24] to-[#2C3035]">
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {item.marketPrice > 0 && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-sm">
                  <button
                    onClick={() => onToggleCart(item.id)}
                    className={`px-4 h-8 rounded-lg font-medium text-xs transition-all duration-200 transform scale-95 group-hover:scale-100 ${
                      item.inCart
                        ? 'bg-[#06FF4C] text-[#1E2128] hover:bg-[#00ff44] flex items-center gap-1.5'
                        : 'bg-[#3C73DD] text-white hover:bg-[#4d82ec]'
                    }`}
                  >
                    {item.inCart ? (
                      <>
                        <Check size={14} />
                        В корзине
                      </>
                    ) : (
                      'Добавить'
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-xs font-medium text-white/90 line-clamp-2 flex-1 group-hover:text-white transition-colors">
                  {item.name}
                </h3>
                <button
                  onClick={() => handleCopy(item.name, item.id)}
                  className={`shrink-0 w-6 h-6 rounded-lg bg-[#191C22] flex items-center justify-center transition-all duration-200 ${
                    copiedId === item.id 
                      ? 'text-[#06FF4C] scale-110' 
                      : 'text-white/50 hover:text-white hover:scale-110'
                  }`}
                >
                  {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/50 mb-0.5">Цена за штуку</p>
                  <p className={`text-xs ${item.marketPrice === 0 ? 'text-white/50 line-through' : 'text-[rgb(77,174,252)]'}`}>
                    {currency.symbol} {item.basePrice.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-white/50 mb-0.5">Итого</p>
                  <p className={`text-xs font-bold transition-colors duration-200 ${
                    item.marketPrice === 0 
                      ? 'text-white/50 line-through'
                      : item.inCart 
                        ? 'text-[rgb(6,255,76)]' 
                        : 'text-[rgb(6,255,76)]'
                  }`}>
                    {currency.symbol} {(item.marketPrice * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Количество:</span>
                  <span className="font-medium text-white">x{item.quantity || 1}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}