import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import { useLotteryRates } from "@/hooks/use-lottery-rates"

interface GameRatesDisplayProps {
  gameType: string;
}

export function GameRatesDisplay({}: // gameType
GameRatesDisplayProps) {
  // const rates = useLotteryRates(gameType)
  const rates = [{ clientPrice: 100, id: 'single-lot', name: 'Single Lot' }];
  if (rates.length === 0) {
    return null;
  }

  return (
    <div className='border rounded-md mt-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-1/3'>Lot Group</TableHead>
            <TableHead className='w-1/3'>Price</TableHead>
            <TableHead className='w-1/3'>Win Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.map((rate) => (
            <TableRow key={rate.id}>
              <TableCell className='font-medium'>{rate.name}</TableCell>
              <TableCell>₹{rate.clientPrice.toFixed(2)}</TableCell>
              <TableCell>
                {rate.id.includes('single')
                  ? '₹100'
                  : rate.id.includes('double')
                  ? '₹1,000'
                  : rate.id.includes('three')
                  ? '₹' + rate.id.split('-')[2]
                  : rate.id.includes('four')
                  ? '₹' + rate.id.split('-')[2].toUpperCase()
                  : '₹0'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
