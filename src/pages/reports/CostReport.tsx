import { useState } from 'react';
import { Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { reportsService } from '@/services/reports.service';
import ReportForm from '@/components/reports/ReportForm';
import { createReportRequest } from '@/utils/reportUtils';

export default function CostReport() {
  const [reportLoading, setReportLoading] = useState(false);
  const navigate = useNavigate();

  const handleCostReport = async (formData: { date?: Date; gameMode: string; time: string ; isBot: boolean }) => {
    const request = createReportRequest(formData);
    if (!request) {
      console.error('Invalid request data');
      return;
    }

    try {
      setReportLoading(true);
      const data = await reportsService.getCostReport(request);
      // Navigate to results page with data
      navigate('/admin/reports/cost/results', { state: { reportData: data, reportType: 'Cost Report', gameModeName: formData.gameMode, date: formData.date, time: formData.time } });
    } catch (error) {
      console.error('Error fetching cost report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <ReportForm
      title="Cost Report"
      description="Generate reports on costs and profit margins"
      icon={<Banknote className='h-5 w-5 mr-2 text-primary' />}
    >
      {(formData) => (
        <>
          <Button 
            className='w-full' 
            onClick={() => handleCostReport(formData)}
            disabled={reportLoading || !formData.gameMode?.trim()}
          >
            {reportLoading ? 'Loading...' : 'COST REPORT'}
          </Button>
        </>
      )}
    </ReportForm>
  );
}
