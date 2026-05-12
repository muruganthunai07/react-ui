import type {
  DepositAndWithdrawDto,
  LotRatesDto,
  PublishResultDto,
  ResultPayload,
  PaginatedResponseOfWithdrawalDto,
  ProcessWithdrawalRequest,
  PaginatedResponseOfAllDepositDto,
  GetTransactionsRequest,
  GetTransactionsResponse,
} from '@/types/api';
import API from './api';

const getAdminDashboardData = async () => {
  const res = await API.get('/api/game/GameAdmin/dashboarddata');
  return res.data;
};

const getLotRates = async () => {
  const res = await API.get('/api/game/GameAdmin/lot-rates');
  return res;
};

const updateLotRates = async (data: LotRatesDto[]) => {
  const res = await API.put('/api/game/GameAdmin/lot-rates', data);
  return res;
};

const getUsers = async () => {
  const res = await API.get('/api/AuthAdmin/users');
  return res;
};

const getAdminResults = async (body: ResultPayload) => {
  const res = await API.post(`/api/Results/pending-announced`, body);
  return res;
};

const publishResults = async (body: PublishResultDto) => {
  const res = await API.post('/api/game/GameAdmin/draws/publish', body);
  return res;
};
const updateUser = async (data: {
  userId: number;
  name?: string | null;
  mobileNumber?: string | null;
  role?: number | null;
}) => {
  const res = await API.put('/api/AuthAdmin/update', data);
  return res;
};

const activateUser = async (userId: number) => {
  const res = await API.post('/api/AuthAdmin/activate', { userId });
  return res;
};

const deactivateUser = async (userId: number) => {
  const res = await API.post('/api/AuthAdmin/deactivate', { userId });
  return res;
};

const approveDeposit = async (
  depositId: number,
  body: DepositAndWithdrawDto
) => {
  const res = await API.post(
    `/api/game/GameAdmin/deposit/${depositId}/process`,
    body
  );
  return res;
};

const approveWithdraw = async (
  withdrawlId: number,
  body: DepositAndWithdrawDto
) => {
  const res = await API.post(
    `/api/game/GameAdmin/withdrawals/${withdrawlId}/process`,
    body
  );
  return res;
};
const adminRecharge = async (data: { userId: number; amount: number }) => {
  const res = await API.post('/api/game/GameAdmin/admin-recharge', data);
  return res.data;
};

const addHoliday = async (data: {
  holidayDate: string;
  description: string;
}) => {
  const res = await API.post('/api/Holiday', data);
  return res.data;
};

const deleteHoliday = async (id: number) => {
  const res = await API.delete(`/api/Holiday/${id}`);
  return res.data;
};

const getAllWithdrawals = async (pageNumber = 1, pageSize = 10): Promise<PaginatedResponseOfWithdrawalDto> => {
  const res = await API.get('/api/game/GameAdmin/all-withdrawals', {
    params: { pageNumber, pageSize },
  });
  return res.data;
};

const getAllDeposits = async (pageNumber = 1, pageSize = 10): Promise<PaginatedResponseOfAllDepositDto> => {
  const res = await API.get('/api/game/GameAdmin/all-deposits', {
    params: { pageNumber, pageSize },
  });
  return res.data;
};

const processWithdrawal = async (id: number, body: ProcessWithdrawalRequest) => {
  const res = await API.post(`/api/game/GameAdmin/withdrawals/${id}/process`, body);
  return res.data;
};

const getUserTransactions = async (body: GetTransactionsRequest): Promise<GetTransactionsResponse> => {
  const res = await API.post('/api/Finance/transactions-by-id', body);
  return res.data;
};

export const AdminService = {
  getLotRates,
  updateLotRates,
  getUsers,
  getAdminResults,
  publishResults,
  updateUser,
  activateUser,
  deactivateUser,
  getAdminDashboardData,
  approveDeposit,
  approveWithdraw,
  adminRecharge,
  addHoliday,
  deleteHoliday,
  getAllWithdrawals,
  getAllDeposits,
  processWithdrawal,
  getUserTransactions,
};
