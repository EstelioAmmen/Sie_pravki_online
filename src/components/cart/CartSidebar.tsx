import { X, Minus, Check } from 'lucide-react';
import { InventoryItem, Currency } from '@/types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  currency: Currency;
  onRemoveItem: (id: string) => void;
}

export function CartSidebar({ isOpen, onClose, items, currency, onRemoveItem }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + (item.marketPrice * (item.quantity || 1)), 0);

  return (
    <div 
      className={`fixed top-0 right-0 w-[320px] h-full bg-[#2C3035] shadow-xl transform transition-transform duration-300 ease-in-out z-[10000] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.2)' }}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Корзина</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white/80 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.map(item => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 p-3 bg-[#191C22] rounded-lg mb-3 group hover:bg-[#1E2128] transition-colors duration-200"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white/90 mb-1 truncate">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-[#06FF4C]">
                  {currency.symbol} {(item.marketPrice * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1.5 text-white/50 hover:text-white/80 transition-colors"
              >
                <Minus size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-white/70">Итого:</span>
            <span className="text-lg font-bold text-[#06FF4C]">
              {currency.symbol} {total.toFixed(2)}
            </span>
          </div>
          <button className="w-full h-10 bg-[#3C73DD] hover:bg-[#4d82ec] transition-all duration-200 rounded-lg font-bold text-sm text-white/90 shadow-md hover:shadow-lg hover:scale-[1.02]">
            ОФОРМИТЬ ЗАКАЗ
          </button>
        </div>
      </div>
    </div>
  );
}