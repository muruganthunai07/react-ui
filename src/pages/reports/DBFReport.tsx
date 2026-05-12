import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportForm from '@/components/reports/ReportForm';
import { reportsService } from '@/services/reports.service';
import { createReportRequest } from '@/utils/reportUtils';
import { toast } from 'sonner';

export default function DBFReport() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateDBF = async (formData: { date?: Date; gameMode: string; gameModeName: string; time: string; isBot: boolean }) => {
    try {
      setIsLoading(true);
      
      // Create request object using common utility
      const request = createReportRequest(formData);
      if (!request) {
        toast.error('Invalid request data');
        return;
      }

      // Call the API to generate DBF report
      const { file: blob, filename } = await reportsService.generateDBFReport(request, formData.gameModeName);
      
      // Create blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
      toast.success('Download successful');
    } catch {
      toast.error('No Data Found');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <ReportForm
      title="DBF Sales Report"
      description="Generate and download DBF files for external processing"
      icon={<FileDown className='h-5 w-5 mr-2 text-primary' />}
    >
              {(formData) => (
          <>
            <Button 
              disabled={!formData.gameMode?.trim() || isLoading}
              className='w-full' 
              onClick={() => handleGenerateDBF(formData)}
            >
              {isLoading ? 'Generating...' : 'GENERATE & DOWNLOAD DBF'}
            </Button>
          </>
        )}
    </ReportForm>
  );
}
