import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate, useLocation } from 'react-router-dom';
import type { CostReportDto } from '@/types/reports';
import { generateTablePDF, formatCurrency, formatDateForFilename, formatDate, createCurrencyColumnStyle, createNumberColumnStyle, createDateColumnStyle, createSummaryRowStyle } from '@/utils/pdfGenerator';
import { formatTimeTo12Hour } from '@/lib/utils';

export default function CostReportView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData, reportType, gameModeName, date } = location.state as { 
    reportData: CostReportDto; 
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

  // PDF Generation Function
  const generateCostReportPDF = () => {
    const columns = ['Date', 'Time', 'Lot', 'Details', 'Sales Qty', 'Draw Qty', 'Sale Cost', 'Draw Cost', 'Profit/Loss'];
    const rows = reportData.items.map(item => [
      formatDate(item.date),
      formatTimeTo12Hour(item.time),
      item.lot,
      item.details,
      item.salesQty.toString(),
      item.drawQty.toString(),
      formatCurrency(item.saleCost),
      formatCurrency(item.drawCost),
      formatCurrency(item.profitLoss)
    ]);

    // Add summary rows
    const summaryRows = [
      ['', '', '', 'Single Lot Total', reportData.summary.singleLotTotalQty.toString(), '', formatCurrency(reportData.summary.singleLotTotalCost), formatCurrency(reportData.summary.singleLotTotalDrawCost), formatCurrency(reportData.summary.singleLotTotalProfitLoss)],
      ['', '', '', 'Double Lot Total', reportData.summary.doubleLotTotalQty.toString(), '', formatCurrency(reportData.summary.doubleLotTotalCost), formatCurrency(reportData.summary.doubleLotTotalDrawCost), formatCurrency(reportData.summary.doubleLotTotalProfitLoss)],
      ['', '', '', 'Three Lot Total', reportData.summary.threeLotTotalQty.toString(), '', formatCurrency(reportData.summary.threeLotTotalCost), formatCurrency(reportData.summary.threeLotTotalDrawCost), formatCurrency(reportData.summary.threeLotTotalProfitLoss)],
      ['', '', '', 'Four Lot Total', reportData.summary.fourLotTotalQty.toString(), '', formatCurrency(reportData.summary.fourLotTotalCost), formatCurrency(reportData.summary.fourLotTotalDrawCost), formatCurrency(reportData.summary.fourLotTotalProfitLoss)],
      ['', '', '', 'Grand Total', reportData.summary.grandTotalQty.toString(), '', formatCurrency(reportData.summary.grandTotalAmount), formatCurrency(reportData.summary.grandTotalDrawCost), formatCurrency(reportData.summary.grandTotalProfitLoss)]
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
        5: createNumberColumnStyle(),
        6: { ...createCurrencyColumnStyle(), cellWidth: 25 },
        7: { ...createCurrencyColumnStyle(), cellWidth: 25 },
        8: { ...createCurrencyColumnStyle(), cellWidth: 25 },
      },
      summaryStyles: createSummaryRowStyle()
    });
  };

  const handleDownloadPDF = () => {
    generateCostReportPDF();
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
              Total Amount: ₹{reportData.summary.grandTotalAmount.toFixed(2)}
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
            Showing {reportData.items.length} items
          </p>
        </div>
        <div className="w-full">
          <div className="h-[600px] overflow-auto border rounded-md">
            <div className="min-w-[1000px] p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap w-24">Date</TableHead>
                    <TableHead className="whitespace-nowrap w-20">Time</TableHead>
                    <TableHead className="whitespace-nowrap w-32">Lot</TableHead>
                    <TableHead className="whitespace-nowrap w-48">Details</TableHead>
                    <TableHead className="whitespace-nowrap w-20 text-right">Sales Qty</TableHead>
                    <TableHead className="whitespace-nowrap w-20 text-right">Draw Qty</TableHead>
                    <TableHead className="whitespace-nowrap w-24 text-right">Sale Cost</TableHead>
                    <TableHead className="whitespace-nowrap w-24 text-right">Draw Cost</TableHead>
                    <TableHead className="whitespace-nowrap w-24 text-right">Profit/Loss</TableHead>
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
                        {item.salesQty}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm">
                        {item.drawQty}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm">
                        ₹{item.saleCost.toFixed(2)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm">
                        ₹{item.drawCost.toFixed(2)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.profitLoss >= 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          ₹{item.profitLoss.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* Summary Section */}
                  <TableRow className="border-t-2">
                    <TableCell colSpan={4} className="font-semibold text-sm">
                      Single Lot Total
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {reportData.summary.singleLotTotalQty}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {/* Empty cell for Draw Qty */}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.singleLotTotalCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.singleLotTotalDrawCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          reportData.summary.singleLotTotalProfitLoss >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        ₹{reportData.summary.singleLotTotalProfitLoss.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} className="font-semibold text-sm">
                      Double Lot Total
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {reportData.summary.doubleLotTotalQty}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {/* Empty cell for Draw Qty */}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.doubleLotTotalCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.doubleLotTotalDrawCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          reportData.summary.doubleLotTotalProfitLoss >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        ₹{reportData.summary.doubleLotTotalProfitLoss.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} className="font-semibold text-sm">
                      Three Lot Total
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {reportData.summary.threeLotTotalQty}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {/* Empty cell for Draw Qty */}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.threeLotTotalCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.threeLotTotalDrawCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          reportData.summary.threeLotTotalProfitLoss >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        ₹{reportData.summary.threeLotTotalProfitLoss.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} className="font-semibold text-sm">
                      Four Lot Total
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {reportData.summary.fourLotTotalQty}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      {/* Empty cell for Draw Qty */}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.fourLotTotalCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      ₹{reportData.summary.fourLotTotalDrawCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          reportData.summary.fourLotTotalProfitLoss >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        ₹{reportData.summary.fourLotTotalProfitLoss.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-2 ">
                    <TableCell colSpan={4} className="font-bold text-base">
                      Grand Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-base">
                      {reportData.summary.grandTotalQty}
                    </TableCell>
                    <TableCell className="text-right font-bold text-base">
                      {/* Empty cell for Draw Qty */}
                    </TableCell>
                    <TableCell className="text-right font-bold text-base">
                      ₹{reportData.summary.grandTotalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-base">
                      ₹{reportData.summary.grandTotalDrawCost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-base">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          reportData.summary.grandTotalProfitLoss >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        ₹{reportData.summary.grandTotalProfitLoss.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
