import { FilterOption } from '@/types';

export const sourceOptions: FilterOption[] = [
  { label: 'Steam', value: 'steam' },
  { label: 'TM Market', value: 'tm_market' },
];

export const tradabilityOptions: FilterOption[] = [
  { label: 'Все', value: 'all' },
  { label: 'Обменяемый', value: 'trade' },
  { label: 'Необменяемый', value: 'untrade' },
];

export const categoryOptions: FilterOption[] = [
  { label: 'Все', value: 'all' },
  { label: 'Продаваемый', value: 'marketrable' },
  { label: 'Непродаваемый', value: 'unmarketrable' },
];

export const sortOptions: FilterOption[] = [
  { label: 'По цене (убывание)', value: 'price-desc' },
  { label: 'По цене (возрастание)', value: 'price-asc' },
  { label: 'По количеству (убывание)', value: 'quantity-desc' },
  { label: 'По количеству (возрастание)', value: 'quantity-asc' },
  { label: 'По названию (А-Я)', value: 'name-asc' },
  { label: 'По названию (Я-А)', value: 'name-desc' },
];