'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { PlaceBetDto, BetResultDto } from '../types/api';

interface BetContextType {
  bets: BetResultDto[];
  loading: boolean;
  error: string | null;
  placeBets: (bets: PlaceBetDto[]) => Promise<BetResultDto[]>;
  fetchUserBetsByDraw: (drawId: number) => Promise<void>;
  fetchTodayBets: () => Promise<void>;
  fetchAllBets: () => Promise<void>;
  fetchUserSpecificBets: (userId: number) => Promise<void>;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export function BetProvider({ children }: { children: ReactNode }) {
  const bet = undefined; //useBet();

  return <BetContext.Provider value={bet}>{children}</BetContext.Provider>;
}

export function useBetContext() {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error('useBetContext must be used within a BetProvider');
  }
  return context;
}
