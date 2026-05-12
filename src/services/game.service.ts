import API from './api';
import type { DrawDto, UpdateGameModeDto } from '@/types/api';

export const gameService = {
  async getGameModes() {
    const response = await API.get('/api/Game/game-modes');
    return response.data;
  },  
  async getGameModesAndLots() {
    const response = await API.get('/api/Game/game-modes-all-lots');
    return response.data;
  },
  async getFutureDraws(gameType: number) {
    const response = await API.get(`/api/Game/${gameType}/upcoming-draws`);
    return response.data;
  },
  async getBotDraws(gameType: number) {
    const response = await API.get(`/api/Game/${gameType}/bot-draws`);
    return response.data;
  },
  async getDraws(gameType: string) {
    const response = await API.get(`/api/Game/${gameType}/draws`);
    return response.data;
  },

  async getDrawResult(drawId: string): Promise<DrawDto> {
    const response = await API.get(`/api/Game/draws/${drawId}`);
    return response.data;
  },
  async switchGameMode(id: number) {
    const res = await API.patch(`/api/Game/game-modes/${id}/toggle-status`);
    return res;
  },
  async updateGameMode(id: number, update: UpdateGameModeDto) {
    const res = await API.put(`/api/Game/game-modes/${id}`, update);
    return res;
  },
  async getHolidayData() {
    const res = await API.get('/api/Holiday');
    return res.data;
  },
};
