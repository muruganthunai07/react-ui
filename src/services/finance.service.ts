import type {
  WithdrawalRequest,
  ProcessWithdrawalRequest,
  ResultPayload,
  GetTransactionsRequest,
  GetTransactionsResponse,
} from '@/types/api';
import API from './api';

export const financeService = {
  async getBalance() {
    const response = await API.get('/api/finance/balance');
    return response.data;
  },

  async deposit(request: FormData) {
    const response = await API.post('/api/Finance/deposit', request, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async withdraw(request: WithdrawalRequest) {
    const response = await API.post('/api/Finance/withdraw', request);
    return response.data;
  },

  async processWithdrawal(request: ProcessWithdrawalRequest) {
    const response = await API.post('/api/Finance/process-withdrawal', request);
    return response.data;
  },

  async getTransactions(payload: Partial<ResultPayload>) {
    const response = await API.post(`/api/Finance/transactions`, payload);
    return response.data;
  },
};

export async function getTransactions(
  params: GetTransactionsRequest
): Promise<GetTransactionsResponse> {
  const { data } = await API.post<GetTransactionsResponse>('/api/Finance/transactions', params);
  return data;
}
