export interface ReportRequestDto {
  date?: string; // ISO date string (optional)
  gameModeId: number;
  time?: string; // Time string in HH:mm format
  isBot?: boolean;
}

export interface SalesReportItemDto {
  date: string; // ISO date string
  time: string; // Time string in HH:mm format
  lot: string;
  details: string;
  lotNumber: string;
  qty: number;
  price: number;
  userId: number;
  resultStatus: string;
}

export interface SalesReportDto {
  items: SalesReportItemDto[];
  totalSaleAmount: number;
}

export interface CostReportItemDto {
  date: string; // ISO date string
  time: string; // Time string in HH:mm format
  lot: string;
  details: string;
  salesQty: number;
  drawQty: number;
  saleCost: number;
  drawCost: number;
  profitLoss: number;
}

export interface CostReportSummaryDto {
  singleLotTotalQty: number;
  singleLotTotalCost: number;
  singleLotTotalDrawCost: number;
  singleLotTotalProfitLoss: number;
  doubleLotTotalQty: number;
  doubleLotTotalCost: number;
  doubleLotTotalDrawCost: number;
  doubleLotTotalProfitLoss: number;
  threeLotTotalQty: number;
  threeLotTotalCost: number;
  threeLotTotalDrawCost: number;
  threeLotTotalProfitLoss: number;
  fourLotTotalQty: number;
  fourLotTotalCost: number;
  fourLotTotalDrawCost: number;
  fourLotTotalProfitLoss: number;
  grandTotalQty: number;
  grandTotalAmount: number;
  grandTotalDrawCost: number;
  grandTotalProfitLoss: number;
}

export interface CostReportDto {
  items: CostReportItemDto[];
  summary: CostReportSummaryDto;
}

export interface DrawReportItemDto {
  date: string; // ISO date string
  time: string; // Time string in HH:mm format
  clientNumber: string;
  lotDetails: string;
  prizeDetails: string;
  prizeNumber: string;
  qty: number;
  priceAmount: number;
  paidStatus: string;
}

export interface DrawReportDto {
  items: DrawReportItemDto[];
  totalPrizeAmount: number;
}

export interface DrawWinReportItemDto {
  date: string; // ISO date string
  time: string; // Time string in HH:mm format
  clientNumber: string;
  lotDetails: string;
  prizeDetails: string;
  prizeNumber: string;
  qty: number;
  priceAmount: number;
  paidStatus: string;
}

export interface DrawWinReportDto {
  items: DrawWinReportItemDto[];
  totalPrizeAmount: number;
}

export interface DrawCombinedReportItemDto {
  date: string; // ISO date string
  time: string; // Time string in HH:mm format
  lot: string;
  details: string;
  qty: number;
  totalPrize: number;
}

export interface DrawCombinedReportSummaryDto {
  singleLotGrandTotal: number;
  singleLotGrandTotalAmount: number;
  doubleLotGrandTotal: number;
  doubleLotGrandTotalAmount: number;
  threeLotGrandTotal: number;
  threeLotGrandTotalAmount: number;
  fourLotGrandTotal: number;
  fourLotGrandTotalAmount: number;
  totalAmount: number;
}

export interface DrawCombinedReportDto {
  items: DrawCombinedReportItemDto[];
  summary: DrawCombinedReportSummaryDto;
}

export interface WithdrawCommissionReportRequestDto {
  date: string;
}

export interface WithdrawCommissionReportDto {
  date: string;
  totalWithdrawalCount: number;
  totalCommissionProfit: number;
}

export interface ReferralBonusReportRequestDto {
  date: string;
}

export interface ReferralBonusReportDto {
  date: string;
  primaryCount: number;
  primaryAmount: number;
  secondaryCount: number;
  secondaryAmount: number;
  tertiaryCount: number;
  tertiaryAmount: number;
  totalCount: number;
  totalAmount: number;
}
