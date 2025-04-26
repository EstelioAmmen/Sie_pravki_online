export type FilterOption = {
  label: string;
  value: string;
};

export type Currency = {
  label: string;
  symbol: string;
};

export type LoadingStep = {
  status: 'pending' | 'loading' | 'success' | 'error';
  message: string;
  errorMessage?: string;
};

export type User = {
  steamid: string;
  name: string;
  avatar: string;
} | null;

export interface SteamContextValue {
  resolvedSteamId?: string;
  setResolvedSteamId: (v?: string) => void;
}