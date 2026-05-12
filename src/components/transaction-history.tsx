import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTransactions } from '@/services/finance.service';
import { AdminService } from '@/services/AdminService';
import { TransactionType, TRANSACTION_TYPE_LABELS, type GetTransactionsRequest, type TransactionItem } from '@/types/api';
import { Player } from '@lottiefiles/react-lottie-player';
import noResultsAnimation from '@/assets/lottie/no-results-found.json';
import { BetDeductionView } from './bet-deduction-view';

const TRANSACTION_TYPES: { label: string; value: number }[] = [
  { label: 'Deposit', value: TransactionType.Deposit },
  { label: 'Withdrawal', value: TransactionType.Withdrawal },
  { label: 'Win Payout', value: TransactionType.WinPayout },
  { label: 'Refunds', value: TransactionType.Refund },
  { label: 'Bet Deduction', value: TransactionType.BetDeduction },
  { label: 'Admin Recharge', value: TransactionType.AdminRecharge },
  { label: 'Referral Bonus', value: TransactionType.ReferralBonus },
  { label: 'Win Reversal', value: TransactionType.WinReversal },
];

export interface TransactionHistoryProps {
  userId?: string | null;
  pageSize?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId, pageSize: initialPageSize = 7 }) => {
  const [selectedType, setSelectedType] = useState<number | undefined>(undefined);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically calculate page size based on visible height
  useEffect(() => {
    function updatePageSize() {
      if (containerRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        // Estimate one transaction row height (adjust as needed)
        const rowHeight = 64; // px
        const headerHeight = 60; // px (CardHeader + tabs)
        const available = containerHeight - headerHeight;
        const count = Math.max(3, Math.floor(available / rowHeight));
        setPageSize(count);
      }
    }
    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    setLoading(true);
    const req: GetTransactionsRequest = {
      UserId: userId ? userId.toString() : null,
      PageNumber: page,
      PageSize: pageSize,
    };
    if (selectedType !== undefined) {
      req.TransactionType = selectedType as TransactionType;
    }
    const fetcher = userId ? AdminService.getUserTransactions : getTransactions;
    fetcher(req)
      .then((res) => {
        setTransactions(res.items);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [userId, selectedType, page, pageSize]);

  function handleTabChange(type: number | undefined) {
    setSelectedType(type);
    setPage(1);
  }

  function handlePrevPage() {
    setPage((p) => Math.max(1, p - 1));
  }

  function handleNextPage() {
    setPage((p) => Math.min(totalPages, p + 1));
  }

  function getSign(balanceType: string) {
    return balanceType === 'Credit' ? '+' : '-';
  }

  // Helper function to handle transaction type comparison
  function isBetDeduction(transactionType: TransactionType | string | number): boolean {
    if (transactionType === null || transactionType === undefined) {
      return false;
    }
    
    let typeValue: number;
    
    if (typeof transactionType === 'string') {
      // Handle string conversion more robustly
      const trimmed = transactionType.trim();
      // Try to parse as integer first
      let parsed = parseInt(trimmed, 10);
      if (isNaN(parsed)) {
        // If that fails, try to match against enum names
        const upperTrimmed = trimmed.toUpperCase();
        if (upperTrimmed === 'BETDEDUCTION' || upperTrimmed === 'BET_DEDUCTION') {
          parsed = TransactionType.BetDeduction;
        } else {
          parsed = 0;
        }
      }
      typeValue = parsed;
    } else if (typeof transactionType === 'number') {
      typeValue = transactionType;
    } else {
      // If it's already the enum value, use it directly
      typeValue = transactionType as number;
    }
    
    return typeValue === TransactionType.BetDeduction;
  }

  return (
    <Card ref={containerRef} className="h-full">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <div className="flex overflow-x-auto whitespace-nowrap gap-2 mt-4 pb-2 scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
          <button
            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedType === undefined ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => handleTabChange(undefined)}
            aria-label="All Transactions"
          >
            All
          </button>
          {TRANSACTION_TYPES.map((t) => (
            <button
              key={t.value}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedType === t.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              onClick={() => handleTabChange(t.value)}
              aria-label={t.label}
            >
              {t.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="relative min-h-[200px]">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-48 h-48">
              <Player
                autoplay
                loop
                src={noResultsAnimation}
                style={{ height: 180, width: 180 }}
                aria-label='No results found animation'
              />
            </div>
            <div className="mt-4 text-muted-foreground text-lg font-medium">No transactions found.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id}>
                {isBetDeduction(tx.transactionType) ? (
                  <BetDeductionView transaction={tx} />
                ) : (
                  <Card className="w-full">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{TRANSACTION_TYPE_LABELS[tx.transactionType as TransactionType] || tx.transactionType}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </p>
                          </div>
                          <Badge variant={tx.balanceType === 'Credit' ? 'primary' : 'destructive'} className="text-lg px-3 py-1">
                            {getSign(tx.balanceType)}₹{tx.amount.toFixed(2)}
                          </Badge>
                        </div>

                        {/* Transaction Description */}
                        {tx.description && (
                          <div className="border rounded-lg p-3 bg-muted/30">
                            <p className="text-sm text-muted-foreground">{tx.description}</p>
                          </div>
                        )}

                        {/* Transaction ID */}
                        <div className="text-xs text-muted-foreground">
                          Transaction ID: {tx.id}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Pagination controls, only if there are results and not loading */}
        {!loading && transactions.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="px-3 py-1 rounded bg-muted text-muted-foreground disabled:opacity-50"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-muted text-muted-foreground disabled:opacity-50"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
