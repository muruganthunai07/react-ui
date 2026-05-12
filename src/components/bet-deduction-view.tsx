import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TransactionItem } from '@/types/api';
import { BetNumbersDisplay, type BetNumbers } from './BetNumbersDisplay';

interface BetDeductionViewProps {
  transaction: TransactionItem;
}

interface BetDescriptionDto {
  DrawId: number;
  LotTypeName: string;
  BetNumber: string;
  BetType: number;
  Amount: number;
  Quantity: number;
  /** Backend may use camelCase (C#) or PascalCase JSON */
  gameModeDescription?: string;
  GameModeDescription?: string;
  drawDateTime?: string;
  DrawDateTime?: string;
}

function getGameModeDescription(bet: BetDescriptionDto): string | undefined {
  const v = bet.gameModeDescription ?? bet.GameModeDescription;
  if (v == null) return undefined;
  const s = String(v).trim();
  return s.length > 0 ? s : undefined;
}

function getDrawDateTimeParts(
  bet: BetDescriptionDto
): { label: string; iso: string } | undefined {
  const raw = bet.drawDateTime ?? bet.DrawDateTime;
  if (raw == null || raw === '') return undefined;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return undefined;
  return {
    iso: d.toISOString(),
    label: d.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  };
}

export const BetDeductionView: React.FC<BetDeductionViewProps> = ({ transaction }) => {
  // Parse the JSON description to get BetDescriptionDto array
  const parseBetDescription = (description: string): BetDescriptionDto[] => {
    try {
      const betDescriptions: BetDescriptionDto[] = JSON.parse(description);
      return betDescriptions;
    } catch (error) {
      console.error('Failed to parse bet description JSON:', error);
      return [];
    }
  };

  // Convert bet number string to BetNumbers object
  const parseBetToNumbers = (betNumber: string): BetNumbers => {
    const numbers: BetNumbers = {};
    
    // Handle different bet formats like "A:8" or "A:4 B:8 C:5"
    if (betNumber.includes(':')) {
      const betParts = betNumber.trim().split(/\s+/);
      
      betParts.forEach(part => {
        const [position, value] = part.split(':');
        if (position && value) {
          switch (position.toUpperCase()) {
            case 'X':
              numbers.digitX = value;
              break;
            case 'A':
              numbers.digitA = value;
              break;
            case 'B':
              numbers.digitB = value;
              break;
            case 'C':
              numbers.digitC = value;
              break;
          }
        }
      });
    }
    
    return numbers;
  };

  const betDescriptions = parseBetDescription(transaction.description);
  
  // Group bet descriptions by draw ID
  const groupedByDraw = betDescriptions.reduce((acc, bet) => {
    if (!acc[bet.DrawId]) {
      acc[bet.DrawId] = [];
    }
    acc[bet.DrawId].push(bet);
    return acc;
  }, {} as Record<number, BetDescriptionDto[]>);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Bet Deduction</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(transaction.createdAt).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
            <Badge variant="destructive" className="text-lg px-3 py-1">
              -₹{transaction.amount.toFixed(2)}
            </Badge>
          </div>

          {/* Bet Details */}
          <div className="space-y-2">
            {Object.keys(groupedByDraw).length > 0 ? (
              Object.entries(groupedByDraw).map(([drawId, bets]) => {
                const metaBet = bets[0];
                const gameMode = getGameModeDescription(metaBet);
                const drawWhen = getDrawDateTimeParts(metaBet);
                const hasDrawMeta = Boolean(gameMode || drawWhen);

                return (
                <div key={drawId} className="border rounded-lg p-3 bg-muted/30">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
                    <Badge variant="secondary" className="w-fit text-xs shrink-0">
                      Draw #{drawId}
                    </Badge>
                    {hasDrawMeta && (
                      <div className="flex min-w-0 flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4 sm:gap-y-1">
                        {gameMode && (
                          <span className="min-w-0 break-words">
                            <span className="font-medium text-foreground/90">Game mode</span>
                            <span className="mx-1.5 text-muted-foreground/60" aria-hidden>
                              ·
                            </span>
                            <span>{gameMode}</span>
                          </span>
                        )}
                        {drawWhen && (
                          <span className="min-w-0 shrink-0">
                            <span className="font-medium text-foreground/90">Draw time</span>
                            <span className="mx-1.5 text-muted-foreground/60" aria-hidden>
                              ·
                            </span>
                            <time dateTime={drawWhen.iso}>{drawWhen.label}</time>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {bets.map((bet, betIndex) => {
                      const betNumbers = parseBetToNumbers(bet.BetNumber);
                      
                      return (
                        <div key={betIndex} className="border rounded-lg p-2 bg-background/50">
                          <div className="space-y-2">
                            {/* Bet Type and Amount */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {bet.LotTypeName}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Qty: {bet.Quantity}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-sm">
                                ₹{bet.Amount.toFixed(2)}
                              </Badge>
                            </div>
                            
                            {/* Bet Numbers Display */}
                            <div className="flex justify-right">
                              <BetNumbersDisplay numbers={betNumbers} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                );
              })
            ) : (
              <div className="border rounded-lg p-3 bg-muted/30">
                <p className="text-sm text-muted-foreground">{transaction.description}</p>
              </div>
            )}
          </div>

          {/* Transaction ID */}
          <div className="text-xs text-muted-foreground">
            Transaction ID: {transaction.id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 