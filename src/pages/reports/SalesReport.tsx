import { useState } from 'react';
import { AreaChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { reportsService } from '@/services/reports.service';
import ReportForm from '@/components/reports/ReportForm';
import { createReportRequest } from '@/utils/reportUtils';

export default function SalesReport() {
  const [reportLoading, setReportLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to create report request


  // Handle report generation
  const handleGetReport = async (formData: { date?: Date; gameMode: string; time: string; isBot: boolean }) => {
    const request = createReportRequest(formData);
    if (!request) {
      console.error('Invalid request data');
      return;
    }

    try {
      setReportLoading(true);
      const data = await reportsService.getSalesReport(request);
      // Navigate to results page with data
      navigate('/admin/reports/sales/results', { state: { reportData: data, reportType: 'Sales Report', gameModeName: formData.gameMode, date: formData.date, time: formData.time } });
    } catch (error) {
      console.error('Error fetching sales report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const handleCombinedReport = async (formData: { date?: Date; gameMode: string; time: string; isBot: boolean }) => {
    const request = createReportRequest(formData);
    if (!request) {
      console.error('Invalid request data');
      return;
    }

    try {
      setReportLoading(true);
      const data = await reportsService.getCombinedSalesReport(request);
      // Navigate to results page with data
      navigate('/admin/reports/sales/results', { state: { reportData: data, reportType: 'Combined Sales Report', gameModeName: formData.gameMode, date: formData.date, time: formData.time } });
    } catch (error) {
      console.error('Error fetching combined sales report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const handleNumberWiseReport = async (formData: { date?: Date; gameMode: string; time: string; isBot: boolean }) => {
    const request = createReportRequest(formData);
    if (!request) {
      console.error('Invalid request data');
      return;
    }
    
    try {
      setReportLoading(true);
      const data = await reportsService.getNumberWiseSalesReport(request);
      // Navigate to results page with data
      navigate('/admin/reports/sales/results', { state: { reportData: data, reportType: 'Number-Wise Sales Report', gameModeName: formData.gameMode, date: formData.date, time: formData.time } });
    } catch (error) {
      console.error('Error fetching number-wise sales report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <ReportForm
      title="Sales Report"
      description="Generate reports on sales data for specific dates and game types"
      icon={<AreaChart className='h-5 w-5 mr-2 text-primary' />}
    >
      {(formData) => (
        <>
              <Button 
                className='w-full' 
                onClick={() => handleGetReport(formData)}
                disabled={reportLoading || !formData.gameMode?.trim()}
              >
                {reportLoading ? 'Loading...' : 'GET REPORT'}
              </Button>
              <Button 
                className='w-full' 
                onClick={() => handleCombinedReport(formData)}
                disabled={reportLoading || !formData.gameMode?.trim()}
              >
                {reportLoading ? 'Loading...' : 'COMBINED REPORT'}
              </Button>
              <Button 
                className='w-full' 
                onClick={() => handleNumberWiseReport(formData)}
                disabled={reportLoading || !formData.gameMode?.trim()}
              >
                {reportLoading ? 'Loading...' : 'NUMBER WISE REPORT'}
              </Button>
        </>
      )}
    </ReportForm>
  );
}
