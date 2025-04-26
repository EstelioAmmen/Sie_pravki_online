import { createContext, useContext, useState, ReactNode } from 'react';
import { SteamContextValue } from '@/types/common';

const SteamContext = createContext<SteamContextValue | undefined>(undefined);

export function SteamProvider({ children }: { children: ReactNode }) {
  const [resolvedSteamId, setResolvedSteamId] = useState<string>();

  return (
    <SteamContext.Provider value={{ resolvedSteamId, setResolvedSteamId }}>
      {children}
    </SteamContext.Provider>
  );
}

export function useSteam() {
  const context = useContext(SteamContext);
  if (context === undefined) {
    throw new Error('useSteam must be used within a SteamProvider');
  }
  return context;
}