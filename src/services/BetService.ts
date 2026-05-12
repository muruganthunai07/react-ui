import API from './api';
import type { BulkBetAPIDto } from '../types/api';

const placeBulkBet = async (body: BulkBetAPIDto[]) => {
  const res = await API.post('/api/Bet/bulk', body);
  return res.data;
};

const getUserBetsByDraw = async (drawId: number) => {
  const res = await API.get('/api/Bet/getUserBetsByDraw', {
    params: { drawId },
  });
  return res.data;
};

export const BetService = {
  placeBulkBet,
  getUserBetsByDraw,
};
