import React from 'react';
import { Button } from './ui/button';
import { CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Link } from 'react-router-dom';
import type { BulkBetAPIDto, BulkBetFailedDto } from '@/types/api';
import { Player } from '@lottiefiles/react-lottie-player';
import diceAnimation from '@/assets/lottie/dice-loading-animation.json';
import MarqueeText from './ui/marquee';

interface BetSummaryProps {
  successBets: BulkBetAPIDto[];
  failedBets: BulkBetFailedDto[];
  onClose?: () => void;
}

export const BetSummary: React.FC<BetSummaryProps> = ({ successBets, failedBets }) => {
  return (
    <div className="h-screen w-full bg-background/95 backdrop-blur-sm flex flex-col">
      <MarqueeText text="You will only be charged for successful bets." className="rounded-t-none" />
      <div className="flex flex-col items-center py-4">
        <Player
          autoplay
          loop
          src={diceAnimation}
          style={{ height: 80, width: 80 }}
          className="mb-2"
        />
        <CardTitle className="text-2xl text-foreground">Bet Placement Summary</CardTitle>
        <div className="mt-4">
          <Link to="/">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
              Browse Games
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-2 pb-32">
        {successBets.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-green-600 dark:text-green-400">Successful Bets ({successBets.length})</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Draw</TableHead>
                  <TableHead className="text-foreground">Lot Name</TableHead>
                  <TableHead className="text-foreground">Number(s)</TableHead>
                  <TableHead className="text-foreground">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {successBets.map((bet, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-foreground">{bet.drawId}</TableCell>
                    <TableCell className="text-foreground">{bet.gameModeName} - {bet.lotTypeName}</TableCell>
                    <TableCell className="text-foreground">
                      {[bet.digitX, bet.digitA, bet.digitB, bet.digitC].filter(n => n !== null && n !== undefined).join(' ') || '-'}</TableCell>
                    <TableCell className="text-foreground">₹{bet.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {failedBets.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-red-600 dark:text-red-400">Failed Bets ({failedBets.length})</h3>
            <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-400">
              {failedBets.map((bet, idx) => (
                <li key={idx}>{bet.errorMessage || 'Unknown error'}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetSummary; 