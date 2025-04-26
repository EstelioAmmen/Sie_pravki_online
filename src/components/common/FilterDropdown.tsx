import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { FilterOption } from '@/types';

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function FilterDropdown({ options, value, onChange, label }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 bg-[#2C3035] hover:bg-[#3C3C3C] transition-all duration-200 rounded-lg font-medium text-sm text-white/90 flex items-center gap-2 hover:scale-[1.02]"
      >
        <span>{label}:</span>
        <span className="text-white">{selectedOption?.label}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-[220px] bg-[#2C3035] rounded-xl border-2 border-white/20 shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#3C73DD]/20 transition-colors flex items-center justify-between ${
                value === option.value ? 'text-white' : 'text-white/50'
              }`}
            >
              {option.label}
              {value === option.value && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}