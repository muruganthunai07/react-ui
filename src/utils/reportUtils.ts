import type { ReportRequestDto } from '@/types/reports';

export const createReportRequest = (formData: { 
  date?: Date; 
  gameMode: string; 
  time: string; 
  isBot: boolean 
}): ReportRequestDto | null => {
  if (!formData.gameMode) {
    return null;
  }

  // Get today's date in IST (UTC+5:30) if no specific date is selected
  let requestDate: string | undefined;
  if (formData.date) {
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(formData.date.getTime() + istOffset);
    requestDate = istDate.toISOString().split('T')[0]; // YYYY-MM-DD format in IST
  }
  
  return {
    date: requestDate,
    gameModeId: parseInt(formData.gameMode),
    time: formData.time || undefined,
    isBot: formData.isBot || false // Use the isBot value from the form data
  };
};
