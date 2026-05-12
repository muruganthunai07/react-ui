import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react'; // Added for React.Fragment
import { generateTablePDF, formatCurrency, formatDateForFilename, formatDate, createCurrencyColumnStyle, createNumberColumnStyle, createDateColumnStyle, createStatusColumnStyle, createSummaryRowStyle } from '@/utils/pdfGenerator';
import { formatTimeTo12Hour } from '@/lib/utils';

interface ReportItem {
  date: string;
  time: string;
  details: string;
  lotNumber: string;
  qty: number;
  price: number;
  userId: number;
  resultStatus: string;
}

interface ReportData {
  items: ReportItem[];
  totalSaleAmount: number;
}

// New interfaces for combined and number-wise reports
interface CombinedReportItem {
  date: string;
  time: string;
  lot: string;
  details: string;
  qty: number;
  totalPrice: number;
}

interface CombinedReportData {
  items: CombinedReportItem[];
  summary: {
    singleLotGrandTotal: number;
    singleLotGrandTotalAmount: number;
    doubleLotGrandTotal: number;
    doubleLotGrandTotalAmount: number;   
    threeLotGrandTotal: number;
    threeLotGrandTotalAmount: number;
    fourLotGrandTotal: number;
    fourLotGrandTotalAmount: number;
    totalAmount: number;
  };
}

// New interfaces for number-wise reports
interface NumberWiseReportItem {
  date: string;
  time: string;
  lot: string;
  details: string;
  number: string;
}

interface NumberWiseReportData {
  items: NumberWiseReportItem[];
  summary: {
    singleLotTotal: number;
    doubleLotTotal: number;
    [key: string]: number;
  };
}

// Sub-component for Combined Sales Report
function CombinedSalesReportView({ reportData }: { reportData: CombinedReportData }) {
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
                <TableHead className="whitespace-nowrap w-16 text-right">Qty</TableHead>
                <TableHead className="whitespace-nowrap w-24 text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.items.map((item: CombinedReportItem, index: number) => (
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
                    ₹{item.totalPrice.toFixed(2)}
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
// Sub-component for Number-Wise Sales Report
function NumberWiseSalesReportView({ reportData }: { reportData: NumberWiseReportData }) {
  // Parse number string (e.g., "680 = 1" -> { number: "680", quantity: "1" })
  const parseNumberString = (numberStr: string) => {
    const parts = numberStr.split(" = ");
    return {
      number: parts[0] || "",
      quantity: parts[1] || ""
    };
  };

  // Categorize items into single, double, and others
  const categorizeItems = () => {
    const singleItems: NumberWiseReportItem[] = [];
    const doubleItems: NumberWiseReportItem[] = [];
    const otherGroups: { [key: string]: NumberWiseReportItem[] } = {};

    reportData.items.forEach(item => {
      const normalizedDetails = item.details.toLowerCase();
      
      if (normalizedDetails.includes('single')) {
        singleItems.push(item);
      } else if (normalizedDetails.includes('double')) {
        doubleItems.push(item);
      } else {
        if (!otherGroups[item.details]) {
          otherGroups[item.details] = [];
        }
        otherGroups[item.details].push(item);
      }
    });

    return { singleItems, doubleItems, otherGroups };
  };

  // Get total count for other details (non-single/double)
  const getTotalForOtherDetails = (details: string): number => {
    // First try exact match
    if (reportData.summary[details] !== undefined) {
      return reportData.summary[details];
    }
    
    // Check all summary keys (case-insensitive) for matches
    const normalizedDetails = details.toLowerCase();
    for (const [key, value] of Object.entries(reportData.summary)) {
      if (key.toLowerCase() === normalizedDetails) {
        return value as number;
      }
    }
    
    return 0;
  };

  const { singleItems, doubleItems, otherGroups } = categorizeItems();

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
                <TableHead className="whitespace-nowrap w-32">Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Single Lot Items */}
              {singleItems.length > 0 && (
                <React.Fragment>
                  {singleItems.map((item, index) => {
                    const { number, quantity } = parseNumberString(item.number);
                    return (
                      <TableRow key={`single-${index}`}>
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
                        <TableCell className="whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center justify-center w-8 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                              {number}
                            </span>
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                              {quantity}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Single Lot Total */}
                  <TableRow className="border-t ">
                    <TableCell colSpan={4} className="font-semibold text-sm">
                      Single Lot Total
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      <span className="inline-flex items-center justify-center w-auto px-3 h-6 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                        {reportData.summary.singleLotTotal || 0}
                      </span>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )}

              {/* Double Lot Items */}
              {doubleItems.length > 0 && (
                <React.Fragment>
                  {doubleItems.map((item, index) => {
                    const { number, quantity } = parseNumberString(item.number);
                    return (
                      <TableRow key={`double-${index}`}>
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
                        <TableCell className="whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center justify-center w-8 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                              {number}
                            </span>
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                              {quantity}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Double Lot Total */}
                  <TableRow className="border-t">
                    <TableCell colSpan={4} className="font-semibold text-sm">
                      Double Lot Total
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      <span className="inline-flex items-center justify-center w-auto px-3 h-6 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                        {reportData.summary.doubleLotTotal || 0}
                      </span>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )}

              {/* Other Items (Three, Four, etc.) with totals after each group */}
              {Object.entries(otherGroups).map(([details, items]) => {
                const totalCount = getTotalForOtherDetails(details);
                return (
                  <React.Fragment key={details}>
                    {items.map((item, index) => {
                      const { number, quantity } = parseNumberString(item.number);
                      return (
                        <TableRow key={`${details}-${index}`}>
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
                          <TableCell className="whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center justify-center w-8 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                                {number}
                              </span>
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                                {quantity}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Summary row after each details group */}
                    <TableRow className="border-t">
                      <TableCell colSpan={4} className="font-semibold text-sm">
                        Total for {details}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        <span className="inline-flex items-center justify-center w-auto px-3 h-6 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                          {totalCount}
                        </span>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


export default function SaleReportView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData, reportType, gameModeName, date } = location.state as { 
    reportData: ReportData | CombinedReportData | NumberWiseReportData; 
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
  const generateRegularSalesReportPDF = () => {
    if (!isRegularReport(reportData)) return;
    
    const columns = ['Date', 'Time', 'Details', 'Lot Number', 'Qty', 'Price', 'User ID', 'Status'];
    const rows = reportData.items.map(item => [
      formatDate(item.date),
      formatTimeTo12Hour(item.time),
      item.details,
      item.lotNumber,
      item.qty.toString(),
      formatCurrency(item.price),
      item.userId.toString(),
      item.resultStatus
    ]);

    const filename = `${reportType}_${gameModeName}_${formatDateForFilename(date?.toISOString() || '')}.pdf`;
    
    generateTablePDF({
      title: `${reportType} - ${gameModeName}`,
      filename,
      columns,
      rows,
      columnStyles: {
        0: createDateColumnStyle(),
        4: createNumberColumnStyle(),
        5: { ...createCurrencyColumnStyle(), cellWidth: 25 },
        6: createNumberColumnStyle(),
        7: createStatusColumnStyle(),
      }
    });
  };

  const generateCombinedSalesReportPDF = () => {
    if (!isCombinedReport(reportData)) return;
    
    const columns = ['Date', 'Time', 'Lot', 'Details', 'Qty', 'Total Price'];
    const rows = reportData.items.map(item => [
      formatDate(item.date),
      formatTimeTo12Hour(item.time),
      item.lot,
      item.details,
      item.qty.toString(),
      formatCurrency(item.totalPrice)
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
        5: { ...createCurrencyColumnStyle(), cellWidth: 45, fontSize: 7, overflow: 'visible' },
      },
      summaryStyles: createSummaryRowStyle()
    });
  };

  const generateNumberWiseSalesReportPDF = () => {
    if (!isNumberWiseReport(reportData)) return;
    
    const columns = ['Date', 'Time', 'Lot', 'Details', 'Number'];
    
    // Categorize items into single, double, and others
    const singleItems: typeof reportData.items = [];
    const doubleItems: typeof reportData.items = [];
    const otherGroups: { [key: string]: typeof reportData.items } = {};

    reportData.items.forEach(item => {
      const normalizedDetails = item.details.toLowerCase();
      
      if (normalizedDetails.includes('single')) {
        singleItems.push(item);
      } else if (normalizedDetails.includes('double')) {
        doubleItems.push(item);
      } else {
        if (!otherGroups[item.details]) {
          otherGroups[item.details] = [];
        }
        otherGroups[item.details].push(item);
      }
    });

    // Helper function to get total for other details (non-single/double)
    const getTotalForOtherDetails = (details: string): number => {
      if (reportData.summary[details] !== undefined) {
        return reportData.summary[details];
      }
      const normalizedDetails = details.toLowerCase();
      for (const [key, value] of Object.entries(reportData.summary)) {
        if (key.toLowerCase() === normalizedDetails) {
          return value as number;
        }
      }
      return 0;
    };

    // Build rows
    const rows: string[][] = [];
    
    // Add single lot items
    singleItems.forEach(item => {
      rows.push([
        formatDate(item.date),
        formatTimeTo12Hour(item.time),
        item.lot,
        item.details,
        item.number
      ]);
    });
    // Add single lot total
    if (singleItems.length > 0) {
      rows.push([
        '', '', '', 
        'Single Lot Total', 
        (reportData.summary.singleLotTotal || 0).toString()
      ]);
    }
    
    // Add double lot items
    doubleItems.forEach(item => {
      rows.push([
        formatDate(item.date),
        formatTimeTo12Hour(item.time),
        item.lot,
        item.details,
        item.number
      ]);
    });
    // Add double lot total
    if (doubleItems.length > 0) {
      rows.push([
        '', '', '', 
        'Double Lot Total', 
        (reportData.summary.doubleLotTotal || 0).toString()
      ]);
    }
    
    // Add other items with totals after each group
    Object.entries(otherGroups).forEach(([details, items]) => {
      items.forEach(item => {
        rows.push([
          formatDate(item.date),
          formatTimeTo12Hour(item.time),
          item.lot,
          item.details,
          item.number
        ]);
      });
      
      // Add summary row for this details group
      const totalCount = getTotalForOtherDetails(details);
      rows.push([
        '', '', '', 
        `Total for ${details}`, 
        totalCount.toString()
      ]);
    });

    const filename = `${reportType}_${gameModeName}_${formatDateForFilename(date?.toISOString() || '')}.pdf`;
    
    generateTablePDF({
      title: `${reportType} - ${gameModeName}`,
      filename,
      columns,
      rows,
      columnStyles: {
        0: createDateColumnStyle(),
        4: createNumberColumnStyle(),
      }
    });
  };

  const handleDownloadPDF = () => {
    if (reportType === 'Combined Sales Report' && isCombinedReport(reportData)) {
      generateCombinedSalesReportPDF();
    } else if (reportType === 'Number-Wise Sales Report' && isNumberWiseReport(reportData)) {
      generateNumberWiseSalesReportPDF();
    } else if (isRegularReport(reportData)) {
      generateRegularSalesReportPDF();
    }
  };

  // Type guards
  const isCombinedReport = (data: ReportData | CombinedReportData | NumberWiseReportData): data is CombinedReportData => 
    'summary' in data && 'totalAmount' in data.summary;
  
  const isNumberWiseReport = (data: ReportData | CombinedReportData | NumberWiseReportData): data is NumberWiseReportData => 
    'summary' in data && 'singleLotTotal' in data.summary;
  
  const isRegularReport = (data: ReportData | CombinedReportData | NumberWiseReportData): data is ReportData => 
    'totalSaleAmount' in data;

  // Render appropriate component based on report type
  const renderReportContent = () => {
    if (reportType === 'Combined Sales Report' && isCombinedReport(reportData)) {
      return <CombinedSalesReportView reportData={reportData} />;
    } else if (reportType === 'Number-Wise Sales Report' && isNumberWiseReport(reportData)) {
      return <NumberWiseSalesReportView reportData={reportData} />;
    } else if (isRegularReport(reportData)) {
      // Default case - Regular Sales Report (existing implementation)
      return (
        <div className="w-full">
          <div className="h-[600px] overflow-auto border rounded-md">
            <div className="min-w-[800px] p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap w-24">Date</TableHead>
                    <TableHead className="whitespace-nowrap w-20">Time</TableHead>
                    <TableHead className="whitespace-nowrap w-48">Details</TableHead>
                    <TableHead className="whitespace-nowrap w-32">
                      Lot Number
                    </TableHead>
                    <TableHead className="whitespace-nowrap w-16 text-right">Qty</TableHead>
                    <TableHead className="whitespace-nowrap w-24 text-right">Price</TableHead>
                    <TableHead className="whitespace-nowrap w-20">User ID</TableHead>
                    <TableHead className="whitespace-nowrap w-24">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.items.map((item: ReportItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatTimeTo12Hour(item.time)}
                      </TableCell>
                      <TableCell
                        className="max-w-[180px] truncate whitespace-nowrap text-sm"
                        title={item.details}
                      >
                        {item.details}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {item.lotNumber}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm">
                        {item.qty}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm">
                        ₹{item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {item.userId}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.resultStatus === "Won"
                              ? "bg-green-100 text-green-800"
                              : item.resultStatus === "Lost"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.resultStatus}
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
    return null;
  };

  // Get the appropriate total amount for display
  const getTotalAmount = () => {
    if (reportType === 'Combined Sales Report' && isCombinedReport(reportData)) {
      return reportData.summary.totalAmount || 0;
    } else if (reportType === 'Number-Wise Sales Report' && isNumberWiseReport(reportData)) {
      // For number-wise reports, calculate total from summary
      return Object.values(reportData.summary).reduce((sum, value) => sum + value, 0);
    } else if (isRegularReport(reportData)) {
      return reportData.totalSaleAmount || 0;
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
              {reportType === 'Combined Sales Report' 
                ? `Total Amount: ₹${getTotalAmount().toFixed(2)}`
                : reportType === 'Number-Wise Sales Report'
                ? `Total Count: ${getTotalAmount()}`
                : `Total Sale Amount: ₹${getTotalAmount().toFixed(2)}`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleDownloadPDF} title="Download PDF">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
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
