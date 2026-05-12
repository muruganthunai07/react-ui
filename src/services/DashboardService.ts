import API from './api';

const getDashboardData = async () => {
  const res = await API.get('/api/Game/get-dashboard');
  return res.data;
};
const getResults = async (body: unknown = {}) => {
  const res = await API.post('/api/Results', body);
  return res.data;
};
export const DashboardService = {
  getDashboardData,
  getResults,
};
