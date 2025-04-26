export type Game = {
  id: number;
  name: string;
  image: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  marketPrice: number;
  quantity: number;
  inCart: boolean;
  source?: string;
  tradable?: boolean;
  marketable?: boolean;
  appId?: number;
};