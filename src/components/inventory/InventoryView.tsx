import { useState } from 'react';
import { Download, Check, Copy } from 'lucide-react';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { InventoryItem, Currency } from '@/types';
import { sourceOptions, tradabilityOptions, categoryOptions, sortOptions } from '@/constants/filterOptions';

interface InventoryViewProps {
  items: InventoryItem[];
  currency: Currency;
  onToggleCart: (id: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
}

export function InventoryView({ items, currency, onToggleCart, selectedFilter, onFilterChange }: InventoryViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedTradability, setSelectedTradability] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedSource !== 'all' && item.source !== selectedSource) return false;
    if (selectedTradability !== 'all' && item.tradable !== (selectedTradability === 'trade')) return false;
    if (selectedCategory !== 'all' && item.marketable !== (selectedCategory === 'marketrable')) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (selectedFilter) {
      case 'price-asc':
        return a.marketPrice - b.marketPrice;
      case 'price-desc':
        return b.marketPrice - a.marketPrice;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const totalValue = filteredItems.reduce((sum, item) => sum + item.marketPrice, 0);
  const totalItems = filteredItems.length;

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
          <button
            onClick={() => window.print()}
            className="h-10 px-4 bg-[#2C3035] hover:bg-[#3C3C3C] transition-all duration-200 rounded-lg font-medium text-sm text-white/90 flex items-center gap-2 hover:scale-[1.02]"
          >
            <Download size={18} />
            Скачать
          </button>

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
            onChange={onFilterChange}
            label="Сортировка"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#2C3035] rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[200px] object-contain bg-gradient-to-b from-[#1a1d24] to-[#2C3035] p-4 transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center backdrop-blur-sm">
                <button
                  onClick={() => onToggleCart(item.id)}
                  className={`px-6 h-10 rounded-lg font-medium text-sm transition-all duration-200 transform scale-95 group-hover:scale-100 ${
                    item.inCart
                      ? 'bg-[#06FF4C] text-[#1E2128] hover:bg-[#00ff44] flex items-center gap-2'
                      : 'bg-[#3C73DD] text-white hover:bg-[#4d82ec]'
                  }`}
                >
                  {item.inCart ? (
                    <>
                      <Check size={18} />
                      В корзине
                    </>
                  ) : (
                    'Добавить'
                  )}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-sm font-medium text-white/90 line-clamp-2 flex-1 group-hover:text-white transition-colors">
                  {item.name}
                </h3>
                <button
                  onClick={() => handleCopy(item.name, item.id)}
                  className={`shrink-0 w-8 h-8 rounded-lg bg-[#191C22] flex items-center justify-center transition-all duration-200 ${
                    copiedId === item.id 
                      ? 'text-[#06FF4C] scale-110' 
                      : 'text-white/50 hover:text-white hover:scale-110'
                  }`}
                >
                  {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50 mb-1">Цена за штуку</p>
                  <p className="text-sm text-white/90">
                    {currency.symbol} {item.basePrice.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-white/50 mb-1">Итого</p>
                  <p className={`text-sm font-bold transition-colors duration-200 ${
                    item.inCart ? 'text-[#06FF4C]' : 'text-white group-hover:text-[#06FF4C]'
                  }`}>
                    {currency.symbol} {(item.marketPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/50">Количество:</span>
                  <span className="font-medium text-white">x{item.quantity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}