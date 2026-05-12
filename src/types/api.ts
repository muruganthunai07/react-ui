// Auth Types
export interface UserLoginRequest {
  mobileNumber: string;
  password: string;
}
export interface DashboardItem {
  isLoggedIn: boolean;
  bannerImageUrls: string[];
  bannerMessage?: string;
  helpNumber?: string;
  appName: string;
  gameModes: GameModeDto[];
  isHoliday: boolean;
  userBalance: {
    totalBalance: number;
    winningBalance: number;
  };
}

export interface VerifyOtp {
  mobileNumber: string;
  otp: string;
}
export interface UserRegisterRequest {
  name: string;
  mobileNumber: string;
  password: string;
  role?: number;
}

export interface OTPVerificationRequest {
  mobileNumber: string;
  otp: string;
}

export interface ResetPasswordRequest {
  mobileNumber: string;
  otp: string;
  newPassword: string;
}

// Result Types
export interface ResultDto {
  drawId: number;
  drawDateTime: string;
  digitX?: number | null;
  digitA?: number | null;
  digitB?: number | null;
  digitC?: number | null;
  gameModeName?: string | null;
  gameModeDescription?: string | null;
}
export interface ResultResponse {
  items: ResultDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
export interface ResultFilter {
  gameModeId?: number;
  drawDateTimeFrom?: string;
  drawDateTimeTo?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
export interface ResultFilterResponse {
  items: ResultDto[];
  totalCount: number;
}

export interface ResultPayload {
  startDate: string | null;
  endDate: string | null;
  gameModeId: number | null;
  pageNumber: number;
  pageSize: number;
  searchString?: string;
}

// Game Types
export interface GameModeDto {
  id: number;
  name: string;
  description: string;
  betCloseTimeSeconds: number;
  gameTimes: string[]; // TimeSpan in C# will be represented as string in TypeScript
  isActive: boolean;
  isBot: boolean;
  botDetails: string;
  playableLots: PlayableLots[];
}
export interface PlayableLots {
  id: number;
  name: string;
  type: string; // 'Single', 'Double', etc.
  agentPrice: number;
  clientPrice: number;
  winningAmount: number;
}
export interface AllLots {
  id: number;
  name: string;
}
export interface GameAndAllLots {
  gameModes: GameModeDto[];
  allLots: AllLots[];
}

export interface DrawDto {
  drawId: number;
  lotteryId: number;
  drawDateTime: string;
  digitX?: number;
  digitA?: number;
  digitB?: number;
  digitC?: number;
  publishedBy?: string;
  publishedAt?: string;
  status: number;
  BetCloseTimeSeconds: number;
  botDetails: { IntervalMin: number };
}

// Error model for Game API responses
export interface ApiError {
  detail: string;
  instance?: string;
  isError: boolean;
  errors?: string[];
}

// Bet Types
export interface PlaceBetDto {
  drawId: number;
  gameModeId: number;
  lotTypeId: number;
  betType: number;
  digitX: number;
  digitA: number;
  digitB: number;
  digitC: number;
  amount: number;
}

export interface BetResultDto {
  betId: number;
  userId: string;
  drawId: number;
  gameModeName: string;
  lotTypeName: string;
  betType: number;
  digitX: number;
  digitA: number;
  digitB: number;
  digitC: number;
  amount: number;
  status: number;
  winAmount?: number;
  createdAt: string;
}

// Finance Types
export interface BalanceResponse {
  totalBalance: number;
  winningBalance: number;
}

export interface DepositRequest {
  amount: number;
  transactionId?: string;
  paymentScreenshot?: File | null;
  notes?: string;
}

export interface WithdrawalRequest {
  amount: number;
  paymentDetails?: string;
  accountType?: string;
  notes?: string;
}

export interface Transaction {
  id: number;
  userId: string;
  amount: number;
  balanceType: number;
  transactionType: number;
  description?: string;
  transactionId?: string;
  paymentScreenshot?: string;
  notes?: string;
  status: number;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
  relatedId?: number;
  relatedType?: string;
  createdAt: string;
}

export interface ProcessWithdrawalRequest {
  isApproved: boolean;
  rejectionReason?: string;
}

// Enums
export enum BetType {
  Single = 0,
  Double = 1,
  Triple = 2,
  Box = 3,
}

export enum BetStatus {
  Pending = 0,
  Won = 1,
  Lost = 2,
}

export enum TransactionType
{
    WinPayout = 0,
    AdminRecharge =1,
    BetDeduction=2,
    ReferralBonus=3,
    WinReversal=4,
    Deposit=5,
    Withdrawal=6,
    Refund=7
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.Deposit]: 'Deposit',
  [TransactionType.WinPayout]: 'Win Payout',
  [TransactionType.Withdrawal]: 'Withdrawal',
  [TransactionType.AdminRecharge]: 'Admin Recharge',
  [TransactionType.BetDeduction]: 'Bet Deduction',
  [TransactionType.ReferralBonus]: 'Referral Bonus',
  [TransactionType.WinReversal]: 'Win Reversal',
  [TransactionType.Refund]: 'Refund',
};

// Lucide icon names for each transaction type
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  RefreshCw,
  MinusCircle,
  RefreshCwOff,
  WindIcon,
  CakeSlice,
} from 'lucide-react';

export const TRANSACTION_TYPE_ICONS: Record<TransactionType, unknown> = {
  [TransactionType.Deposit]: ArrowDownCircle,
  [TransactionType.WinPayout]: Gift,
  [TransactionType.Withdrawal]: ArrowUpCircle,
  [TransactionType.AdminRecharge]: RefreshCw,
  [TransactionType.BetDeduction]: MinusCircle,
  [TransactionType.ReferralBonus]: RefreshCwOff,
  [TransactionType.WinReversal]: WindIcon,
  [TransactionType.Refund]: CakeSlice,
};

export enum TransactionStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum BalanceType {
  Main = 0,
  Winning = 1,
}

//Bet Types
export interface BulkBetDto {
  drawId: number;
  lotTypeId: number;
  digitX: string;
  digitA: string;
  digitB: string;
  digitC: string;
  quantity: number;
  amount: number;
}
export interface BulkBetResponse {
  isError: boolean;
  detail: string;
  failedBets: BulkBetFailedDto[];
  successfulBets: BulkBetAPIDto[];
}
export interface BulkBetAPIDto {
  drawId: number;
  lotTypeId: number;
  gameModeName?: string | null;
  lotTypeName?: string | null;
  digitX: number | null;
  digitA: number | null;
  digitB: number | null;
  digitC: number | null;
  quantity: number;
  amount: number;
  errorMessage?: string | null;
}

export interface BulkBetFailedDto {
  errorMessage: string | null;
}

//Admin Dashboard
export type AdminDashboardData = {
  totalRevenue: number;
  revenueChangePercentage: number;
  pendingDepositsCount: number;
  pendingDepositsAmount: number;
  activeUsersCount: number;
  activeUsersChange: number;
  recentActivities: {
    username: string;
    activityTime: string;
    betAmount: number;
  }[];
  gamePerformances: {
    gameName: string;
    revenue: number;
  }[];
};

export interface HolidayDto {
  holidayId: number;
  holidayDate: string;
  description: string | null;
  createdAt: string;
  tenantId: number | null;
}

// LOT Rates API
export interface LotRatesDto {
  lotTypeId: number;
  agentPrice: number;
  clientPrice: number;
}

// Users API
export interface AllUsersDto {
  id: number;
  name: string;
  mobileNumber: string;
  totalBalance: number;
  winningBalance: number;
  lastBalanceUpdate: string;
  isActive: boolean;
  role: string;
}

// Admin Results API
export interface AdminResultsItems {
  drawId: number;
  drawDateTime: string;
  digitA: number | null;
  digitB: number | null;
  digitC: number | null;
  digitX: number | null;
  gameModeName: string | null;
  drawState: string;
  publishedBy: string | null;
  publishedAt: string | null;
}

export interface AdminResultsDto {
  items: AdminResultsItems[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

//Publish Result
export interface PublishResultDto {
  drawId: number;
  digitX: number | null;
  digitA: number | null;
  digitB: number | null;
  digitC: number | null;
}

//All Transaction
export interface AllTransactionDto {
  id: number;
  userId: string | null;
  amount: number;
  balanceType: number;
  transactionType: string;
  description: string | null;
  transactionId: string | null;
  paymentScreenshot: string | null;
  notes: string | null;
  status: string;
  processedAt: string | null;
  processedBy: string | null;
  rejectionReason: string | null;
  relatedId: number | null;
  createdAt: string;
  tenantId: number | null;
  totalCount: number | null;
}
export interface TransactionsPaginationDto {
  items: AllTransactionDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

//Deposit and Withdraw API
export interface DepositAndWithdrawDto {
  isApproved: boolean;
  rejectionReason?: string | null;
}

// File Types
export enum FileType {
  Image = 0,
}

export enum FileUse {
  BannerImage = 0,
  QRCode = 1,
  PaymentScreenshot = 2,
  ProfilePicture = 3,
}

export interface FileUploadRequest {
  file: File;
  fileType: FileType;
  fileUse: FileUse;
}

export interface FileResponse {
  id: number;
  fileName: string;
  filePath: string;
  fileType: FileType;
  fileUse: FileUse;
  createdAt: string;
}

// Add after AllTransactionDto and TransactionsPaginationDto
export interface WithdrawalDto {
  id: number;
  userId: string | null;
  amount: number;
  status: string;
  rejectionReason: string | null;
  paymentDetails: string | null;
  accountType: string | null;
  requestedAt: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  notes: string | null;
  withdrawalId: number;
}

export interface PaginatedResponseOfWithdrawalDto {
  items: WithdrawalDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// All Deposits API
export interface AllDepositDto {
  depositId: number;
  userId: string;
  userName: string;
  amount: number;
  status: string;
  transactionId: string;
  paymentScreenshot: string;
  requestedAt: string;
}

export interface PaginatedResponseOfAllDepositDto {
  items: AllDepositDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface GetTransactionsRequest {
  StartDate?: string;
  EndDate?: string;
  PageNumber?: number;
  PageSize?: number;
  UserId: string | null;
  TransactionType?: TransactionType;
}

export interface TransactionItem {
  id: number;
  userId: string;
  amount: number;
  balanceType: 'Credit' | 'Debit';
  transactionType: TransactionType;
  description: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
}

export interface GetTransactionsResponse {
  items: TransactionItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Add after GameAndAllLots or near similar DTOs
export interface UpdateGameModeDto {
  BetCloseTimeSeconds?: number;
  TargetProfit?: number;
  PlayableLotTypeIds?: number[];
  GameTimes?: string[]; // TimeSpan[] in C# is string[] in TS
}
