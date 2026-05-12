import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, useLocation } from 'react-router-dom';
import type { 
  DrawReportDto, 
  DrawWinReportDto, 
  DrawCombinedReportDto 
} from '@/types/reports';
import { generateTablePDF, formatCurrency, formatDateForFilename, formatDate, createCurrencyColumnStyle, createNumberColumnStyle, createDateColumnStyle, createStatusColumnStyle, createSummaryRowStyle } from '@/utils/pdfGenerator';
import { formatTimeTo12Hour } from '@/lib/utils';

// Sub-component for Draw Report (Regular)
function DrawReportTableView({ reportData }: { reportData: DrawReportDto }) {
  return (
    <div className="w-full">
      <div className="h-[600px] overflow-auto border rounded-md">
        <div className="min-w-[1000px] p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap w-24">Date</TableHead>
                <TableHead className="whitespace-nowrap w-20">Time</TableHead>
                <TableHead className="whitespace-nowrap w-32">User ID</TableHead>
                <TableHead className="whitespace-nowrap w-48">Lot Details</TableHead>
                <TableHead className="whitespace-nowrap w-48">Prize Details</TableHead>
                <TableHead className="whitespace-nowrap w-32">Prize Number</TableHead>
                <TableHead className="whitespace-nowrap w-20 text-right">Qty</TableHead>
                <TableHead className="whitespace-nowrap w-24 text-right">Price Amount</TableHead>
                <TableHead className="whitespace-nowrap w-24">Paid Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatTimeTo12Hour(item.time)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {item.clientNumber}
                  </TableCell>
                  <TableCell
                    className="max-w-[180px] truncate whitespace-nowrap text-sm"
                    title={item.lotDetails}
                  >
                    {item.lotDetails}
                  </TableCell>
                  <TableCell
                    className="max-w-[180px] truncate whitespace-nowrap text-sm"
                    title={item.prizeDetails}
                  >
                    {item.prizeDetails}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {item.prizeNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right text-sm">
                    {item.qty}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right text-sm">
                    ₹{item.priceAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.paidStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : item.paidStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.paidStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Draw Win Report
function DrawWinReportView({ reportData }: { reportData: DrawWinReportDto }) {
  return (
    <div className="w-full">
      <div className="h-[600px] overflow-auto border rounded-md">
        <div className="min-w-[1000px] p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap w-24">Date</TableHead>
                <TableHead className="whitespace-nowrap w-20">Time</TableHead>
                <TableHead className="whitespace-nowrap w-32">User ID</TableHead>
                <TableHead className="whitespace-nowrap w-48">Lot Details</TableHead>
                <TableHead className="whitespace-nowrap w-48">Prize Details</TableHead>
                <TableHead className="whitespace-nowrap w-32">Prize Number</TableHead>
                <TableHead className="whitespace-nowrap w-20 text-right">Qty</TableHead>
                <TableHead className="whitespace-nowrap w-24 text-right">Price Amount</TableHead>
                <TableHead className="whitespace-nowrap w-24">Paid Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatTimeTo12Hour(item.time)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {item.clientNumber}
                  </TableCell>
                  <TableCell
                    className="max-w-[180px] truncate whitespace-nowrap text-sm"
                    title={item.lotDetails}
                  >
                    {item.lotDetails}
                  </TableCell>
                  <TableCell
                    className="max-w-[180px] truncate whitespace-nowrap text-sm"
                    title={item.prizeDetails}
                  >
                    {item.prizeDetails}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {item.prizeNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right text-sm">
                    {item.qty}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right text-sm">
                    ₹{item.priceAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.paidStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : item.paidStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.paidStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Draw Combined Report
function DrawCombinedReportView({ reportData }: { reportData: DrawCombinedReportDto }) {
  return (
    <div className="w-full">
      <div className="h-[600px] overflow-auto border rounded-md">
        <div className="min-w-[800px] p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap w-24">Date</TableHead>
                <TableHead className="whitespace-nowrap w-20">Time</TableHead>
                <TableHead className="whitespace-nowrap w-32">Lot</TableHead>
                <TableHead className="whitespace-nowrap w-48">Details</TableHead>
                <TableHead className="whitespace-nowrap w-20 text-right">Qty</TableHead>
                <TableHead className="whitespace-nowrap w-24 text-right">Total Prize</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatTimeTo12Hour(item.time)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {item.lot}
                  </TableCell>
                  <TableCell
                    className="max-w-[180px] truncate whitespace-nowrap text-sm"
                    title={item.details}
                  >
                    {item.details}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right text-sm">
                    {item.qty}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right text-sm">
                    ₹{item.totalPrize.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Summary Section */}
              <TableRow className="border-t-2">
                <TableCell colSpan={4} className="font-semibold text-sm">
                  Single Lot Grand Total
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {reportData.summary.singleLotGrandTotal}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  ₹{reportData.summary.singleLotGrandTotalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="font-semibold text-sm">
                  Double Lot Grand Total
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {reportData.summary.doubleLotGrandTotal}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  ₹{reportData.summary.doubleLotGrandTotalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="font-semibold text-sm">
                  Three Lot Grand Total
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {reportData.summary.threeLotGrandTotal}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  ₹{reportData.summary.threeLotGrandTotalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} className="font-semibold text-sm">
                  Four Lot Grand Total
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {reportData.summary.fourLotGrandTotal}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  ₹{reportData.summary.fourLotGrandTotalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow className="border-t-2">
                <TableCell colSpan={4} className="font-bold text-base">
                  Total Amount
                </TableCell>
                <TableCell className="text-right font-bold text-base">
                  {/* Empty cell for Qty */}
                </TableCell>
                <TableCell className="text-right font-bold text-base">
                  ₹{reportData.summary.totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default function DrawReportView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData, reportType, gameModeName, date } = location.state as { 
    reportData: DrawReportDto | DrawWinReportDto | DrawCombinedReportDto; 
    reportType: string;
    gameModeName: string;
    date: Date;
  } || {};

  // Redirect if no data
  if (!reportData || !reportType) {
    navigate('/admin/reports');
    return null;
  }

  const handleBack = () => {
    navigate('/admin/reports');
  };

  // PDF Generation Functions
  const generateDrawReportPDF = () => {
    if (!isDrawReport(reportData)) return;
    
    const columns = ['Date', 'Time', 'User ID', 'Lot Details', 'Prize Details', 'Prize Number', 'Qty', 'Price Amount', 'Paid Status'];
    const rows = reportData.items.map(item => [
      formatDate(item.date),
      formatTimeTo12Hour(item.time),
      item.clientNumber,
      item.lotDetails,
      item.prizeDetails,
      item.prizeNumber,
      item.qty.toString(),
      formatCurrency(item.priceAmount),
      item.paidStatus
    ]);

    const filename = `${reportType}_${gameModeName}_${formatDateForFilename(date?.toISOString() || '')}.pdf`;
    
    generateTablePDF({
      title: `${reportType} - ${gameModeName}`,
      filename,
      columns,
      rows,
      columnStyles: {
        0: createDateColumnStyle(),
        6: createNumberColumnStyle(),
        7: { ...createCurrencyColumnStyle(), cellWidth: 45, fontSize: 7, overflow: 'visible' },
        8: createStatusColumnStyle(),
      }
    });
  };

  const generateDrawWinReportPDF = () => {
    if (!isDrawWinReport(reportData)) return;
    
    const columns = ['Date', 'Time', 'User ID', 'Lot Details', 'Prize Details', 'Prize Number', 'Qty', 'Price Amount', 'Paid Status'];
    const rows = reportData.items.map(item => [
      formatDate(item.date),
      formatTimeTo12Hour(item.time),
      item.clientNumber,
      item.lotDetails,
      item.prizeDetails,
      item.prizeNumber,
      item.qty.toString(),
      formatCurrency(item.priceAmount),
      item.paidStatus
    ]);

    const filename = `${reportType}_${gameModeName}_${formatDateForFilename(date?.toISOString() || '')}.pdf`;
    
    generateTablePDF({
      title: `${reportType} - ${gameModeName}`,
      filename,
      columns,
      rows,
      columnStyles: {
        0: createDateColumnStyle(),
        6: createNumberColumnStyle(),
        7: { ...createCurrencyColumnStyle(), cellWidth: 45, fontSize: 7, overflow: 'visible' },
        8: createStatusColumnStyle(),
      }
    });
  };

  const generateDrawCombinedReportPDF = () => {
    if (!isDrawCombinedReport(reportData)) return;
    
    const columns = ['Date', 'Time', 'Lot', 'Details', 'Qty', 'Total Prize'];
    const rows = reportData.items.map(item => [
      formatDate(item.date),
      formatTimeTo12Hour(item.time),
      item.lot,
      item.details,
      item.qty.toString(),
      formatCurrency(item.totalPrize)
    ]);

    // Add summary rows
    const summaryRows = [
      ['', '', '', 'Single Lot Grand Total', reportData.summary.singleLotGrandTotal.toString(), formatCurrency(reportData.summary.singleLotGrandTotalAmount)],
      ['', '', '', 'Double Lot Grand Total', reportData.summary.doubleLotGrandTotal.toString(), formatCurrency(reportData.summary.doubleLotGrandTotalAmount)],
      ['', '', '', 'Three Lot Grand Total', reportData.summary.threeLotGrandTotal.toString(), formatCurrency(reportData.summary.threeLotGrandTotalAmount)],
      ['', '', '', 'Four Lot Grand Total', reportData.summary.fourLotGrandTotal.toString(), formatCurrency(reportData.summary.fourLotGrandTotalAmount)],
      ['', '', '', 'Total Amount', '', formatCurrency(reportData.summary.totalAmount)]
    ];

    const filename = `${reportType}_${gameModeName}_${formatDateForFilename(date?.toISOString() || '')}.pdf`;
    
    generateTablePDF({
      title: `${reportType} - ${gameModeName}`,
      filename,
      columns,
      rows,
      summaryRows,
      columnStyles: {
        0: createDateColumnStyle(),
        4: createNumberColumnStyle(),
        5: { ...createCurrencyColumnStyle(), cellWidth: 55, fontSize: 7, overflow: 'visible' },
      },
      summaryStyles: createSummaryRowStyle()
    });
  };

  const handleDownloadPDF = () => {
    if (reportType === 'Draw Report' && isDrawReport(reportData)) {
      generateDrawReportPDF();
    } else if (reportType === 'Draw Win Report' && isDrawWinReport(reportData)) {
      generateDrawWinReportPDF();
    } else if (reportType === 'Draw Combined Report' && isDrawCombinedReport(reportData)) {
      generateDrawCombinedReportPDF();
    }
  };

  // Type guards
  const isDrawReport = (data: DrawReportDto | DrawWinReportDto | DrawCombinedReportDto): data is DrawReportDto => 
    'totalPrizeAmount' in data && !('summary' in data);
  
  const isDrawWinReport = (data: DrawReportDto | DrawWinReportDto | DrawCombinedReportDto): data is DrawWinReportDto => 
    'totalPrizeAmount' in data && !('summary' in data);
  
  const isDrawCombinedReport = (data: DrawReportDto | DrawWinReportDto | DrawCombinedReportDto): data is DrawCombinedReportDto => 
    'summary' in data && 'totalAmount' in data.summary;

  // Render appropriate component based on report type
  const renderReportContent = () => {
    if (reportType === 'Draw Report' && isDrawReport(reportData)) {
      return <DrawReportTableView reportData={reportData} />;
    } else if (reportType === 'Draw Win Report' && isDrawWinReport(reportData)) {
      return <DrawWinReportView reportData={reportData} />;
    } else if (reportType === 'Draw Combined Report' && isDrawCombinedReport(reportData)) {
      return <DrawCombinedReportView reportData={reportData} />;
    }
    return null;
  };

  // Get the appropriate total amount for display
  const getTotalAmount = () => {
    if (isDrawCombinedReport(reportData)) {
      return reportData.summary.totalAmount;
    } else if (isDrawReport(reportData) || isDrawWinReport(reportData)) {
      return reportData.totalPrizeAmount;
    }
    return 0;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {reportType} Results
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Total Prize Amount: ₹{getTotalAmount().toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleDownloadPDF} title="Download PDF">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-0">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Report Data
          </h3>
          <p className="text-sm text-muted-foreground">
            Showing {reportData && 'items' in reportData ? reportData.items.length : 0} items
          </p>
        </div>
        {renderReportContent()}
      </div>
    </div>
  );
}
