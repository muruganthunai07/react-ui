import API from './api';
import type {
  ReportRequestDto,
  SalesReportDto,
  CostReportDto,
  DrawReportDto,
  DrawWinReportDto,
  DrawCombinedReportDto,
  WithdrawCommissionReportDto,
  WithdrawCommissionReportRequestDto,
  ReferralBonusReportDto,
  ReferralBonusReportRequestDto
} from '@/types/reports';

class ReportsService {
  async getSalesReport(request: ReportRequestDto): Promise<SalesReportDto> {
    try {
      const response = await API.post<SalesReportDto>('api/reports/sales-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  }


  async getCombinedSalesReport(request: ReportRequestDto): Promise<SalesReportDto> {
    try {
      const response = await API.post<SalesReportDto>('/api/reports/sales-combined-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching combined sales report:', error);
      throw error;
    }
  }

  async getNumberWiseSalesReport(request: ReportRequestDto): Promise<SalesReportDto> {
    try {
      const response = await API.post<SalesReportDto>('/api/reports/sales-numberwise-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching number-wise sales report:', error);
      throw error;
    }
  }

  async getCostReport(request: ReportRequestDto): Promise<CostReportDto> {
    try {
      const response = await API.post<CostReportDto>('/api/reports/cost-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching cost report:', error);
      throw error;
    }
  }

  async getDrawReport(request: ReportRequestDto): Promise<DrawReportDto> {
    try {
      const response = await API.post<DrawReportDto>('/api/reports/draw-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching draw report:', error);
      throw error;
    }
  }

  async getDrawWinReport(request: ReportRequestDto): Promise<DrawWinReportDto> {
    try {
      const response = await API.post<DrawWinReportDto>('/api/reports/draw-win-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching draw win report:', error);
      throw error;
    }
  }

  async getDrawCombinedReport(request: ReportRequestDto): Promise<DrawCombinedReportDto> {
    try {
      const response = await API.post<DrawCombinedReportDto>('/api/reports/draw-combined-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching draw combined report:', error);
      throw error;
    }
  }

  async getWithdrawCommissionReport(request: WithdrawCommissionReportRequestDto): Promise<WithdrawCommissionReportDto> {
    try {
      const response = await API.post<WithdrawCommissionReportDto>('/api/reports/withdraw-commission-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdraw commission report:', error);
      throw error;
    }
  }

  async getReferralBonusReport(request: ReferralBonusReportRequestDto): Promise<ReferralBonusReportDto> {
    try {
      const response = await API.post<ReferralBonusReportDto>('/api/reports/referral-bonus-report', request);
      return response.data;
    } catch (error) {
      console.error('Error fetching referral bonus report:', error);
      throw error;
    }
  }


  async generateDBFReport(request: ReportRequestDto, gameModeName: string): Promise<{ file: Blob; filename: string }> {
    try {
      const response = await API.post<Blob>('/api/reports/generate-dbf-report', request, {
        responseType: 'blob'
      });
      
      // Generate filename locally using the format: {GameName}L{dateTime:ddMMyyyyhhmmtt}.KU1
      const date = request.date ? new Date(request.date) : new Date();
      const time = request.time || '00:00';
      
      // Parse time string (HH:mm format)
      const [hours, minutes] = time.split(':').map(Number);
      const dateTime = new Date(date);
      dateTime.setHours(hours, minutes, 0, 0);
      
      // Format date and time as ddMMyyyyhhmmtt
      const day = dateTime.getDate().toString().padStart(2, '0');
      const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
      const year = dateTime.getFullYear();
      const hour = dateTime.getHours();
      const minute = dateTime.getMinutes();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = (hour % 12 || 12).toString().padStart(2, '0');
      const displayMinute = minute.toString().padStart(2, '0');
      
      // Get first letter of game mode name (e.g., 'K' for Kerala, 'D' for Dear)
      const gameNameFirstLetter = gameModeName.charAt(0).toUpperCase();
      
      const filename = `${gameNameFirstLetter}L${day}${month}${year}${displayHour}${displayMinute}${ampm}.KU1`;
      
      return {
        file: response.data,
        filename: filename
      };
    } catch (error) {
      console.error('Error generating DBF report:', error);
      throw error;
    }
  }
}

export const reportsService = new ReportsService();
