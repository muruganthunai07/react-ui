import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
  }
}

interface FlutterInAppWebView {
  callHandler: (
    handlerName: string,
    filename: string,
    base64: string
  ) => Promise<unknown> | unknown;
}

declare global {
  interface Window {
    flutter_inappwebview?: FlutterInAppWebView;
  }
}

export interface PDFTableConfig {
  title: string;
  filename: string;
  columns: string[];
  rows: string[][];
  summaryRows?: string[][];
  columnStyles?: { [key: string]: Record<string, unknown> };
  headStyles?: { [key: string]: Record<string, unknown> };
  bodyStyles?: { [key: string]: Record<string, unknown> };
  summaryStyles?: Record<string, unknown>;
}

export const formatCurrency = (value: number): string => {
  // Use ASCII-friendly currency text for PDF to avoid unsupported glyph issues
  return `Rs ${value.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatDateForFilename = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

export const savePdfForWebOrFlutter = async (
  doc: jsPDF,
  filename: string
): Promise<unknown> => {
  const flutterBridge =
    typeof window !== 'undefined' ? window.flutter_inappwebview : undefined;
  if (flutterBridge && typeof flutterBridge.callHandler === 'function') {
    const dataUri = doc.output('datauristring'); // data:application/pdf;base64,XXXX
    const base64 = dataUri.split(',')[1] ?? '';
    return flutterBridge.callHandler(
      'downloadPdf',
      filename,
      base64
    );
  }
  doc.save(filename); // normal browser fallback
};

export const generateTablePDF = async (config: PDFTableConfig): Promise<void> => {
  const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation for better table display
  
  // Add title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(config.title, 14, 20);
  
  // Add metadata line
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 30);
  
  // Prepare table data
  const tableData = [...config.rows];
  
  // Add summary rows if provided
  if (config.summaryRows) {
    tableData.push(...config.summaryRows);
  }
  
  // Generate table
  autoTable(doc, {
    head: [config.columns],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
    },
    columnStyles: config.columnStyles || {},
    headStyles: config.headStyles || {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: config.bodyStyles || {},
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 40, right: 14, bottom: 20, left: 14 },
    tableWidth: 'auto',
    // columnWidth: 'auto',
    didDrawPage: (data: { pageNumber: number }) => {
      // Add page numbers
      const pageCount = doc.getNumberOfPages();
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height || pageSize.getHeight();
      
      doc.setFontSize(8);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageSize.width - 30,
        pageHeight - 10
      );
    },
  });
  
  // Save the PDF
  await savePdfForWebOrFlutter(doc, config.filename);
};

export const createCurrencyColumnStyle = (): Record<string, unknown> => ({
  halign: 'right',
});

export const createNumberColumnStyle = (): Record<string, unknown> => ({
  halign: 'right',
});

export const createDateColumnStyle = (): Record<string, unknown> => ({
  halign: 'center',
});

export const createStatusColumnStyle = (): Record<string, unknown> => ({
  halign: 'center',
});

export const createSummaryRowStyle = (): Record<string, unknown> => ({
  fontStyle: 'bold',
  fillColor: [240, 240, 240],
});

export const createGrandTotalRowStyle = (): Record<string, unknown> => ({
  fontStyle: 'bold',
  fillColor: [220, 220, 220],
  textColor: [0, 0, 0],
});
