import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { reportsService } from '@/services/reports.service';
import ReportForm from '@/components/reports/ReportForm';
import { createReportRequest } from '@/utils/reportUtils';

export default function DrawReport() {
  const [reportLoading, setReportLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetReport = async (formData: { date?: Date; gameMode: string; time: string ; isBot: boolean }) => {
    const request = createReportRequest(formData);
    if (!request) {
      console.error('Invalid request data');
      return;
    }

    try {
      setReportLoading(true);
      const data = await reportsService.getDrawReport(request);
      // Navigate to results page with data
      navigate('/admin/reports/draw/results', { state: { reportData: data, reportType: 'Draw Report', gameModeName: formData.gameMode, date: formData.date, time: formData.time } });
    } catch (error) {
      console.error('Error fetching draw report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const handleGetWinReport = async (formData: { date?: Date; gameMode: string; time: string ; isBot: boolean }) => {
    const request = createReportRequest(formData);
    if (!request) {
      console.error('Invalid request data');
      return;
    }

    try {
      setReportLoading(true);
      const data = await reportsService.getDrawWinReport(request);
      // Navigate to results page with data
      navigate('/admin/reports/draw/results', { state: { reportData: data, reportType: 'Draw Win Report', gameModeName: formData.gameMode, date: formData.date, time: formData.time } });
    } catch (error) {
      console.error('Error fetching draw win report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const handleCombinedReport = async (formData: { date?: Date; gameMode: string; time: string ; isBot: boolean }) => {
    const request = createReportRequest(formData);
    if (!request) {
      console.error('Invalid request data');
      return;
    }

    try {
      setReportLoading(true);
      const data = await reportsService.getDrawCombinedReport(request);
      // Navigate to results page with data
      navigate('/admin/reports/draw/results', { state: { reportData: data, reportType: 'Draw Combined Report', gameModeName: formData.gameMode, date: formData.date, time: formData.time } });
    } catch (error) {
      console.error('Error fetching draw combined report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <ReportForm
      title="Draw Report"
      description="Generate reports on draw results and winning details"
      icon={<FileDown className='h-5 w-5 mr-2 text-primary' />}
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
            onClick={() => handleGetWinReport(formData)}
            disabled={reportLoading || !formData.gameMode?.trim()}
          >
            {reportLoading ? 'Loading...' : 'GET WIN REPORT'}
          </Button>
          <Button 
            className='w-full' 
            onClick={() => handleCombinedReport(formData)}
            disabled={reportLoading || !formData.gameMode?.trim()}
          >
            {reportLoading ? 'Loading...' : 'COMBINED REPORT'}
          </Button>
        </>
      )}
    </ReportForm>
  );
}
