import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import lotteryRates from '@/data/lottery-rates.json';

type Rate = {
  id: string;
  name: string;
  agentPrice: number;
  clientPrice: number;
};

export function LotteryRateManager() {
  const [rates, setRates] = useState<Rate[]>(lotteryRates.rates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    agentPrice: string;
    clientPrice: string;
  }>({
    agentPrice: '',
    clientPrice: '',
  });

  const handleEdit = (rate: Rate) => {
    setEditingId(rate.id);
    setEditValues({
      agentPrice: rate.agentPrice.toString(),
      clientPrice: rate.clientPrice.toString(),
    });
  };

  const handleSave = (id: string) => {
    // Validate inputs
    const agentPrice = Number.parseFloat(editValues.agentPrice);
    const clientPrice = Number.parseFloat(editValues.clientPrice);

    if (isNaN(agentPrice) || isNaN(clientPrice)) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid numbers for prices',
        variant: 'destructive',
      });
      return;
    }

    // Update rates
    setRates(
      rates.map((rate) =>
        rate.id === id
          ? {
              ...rate,
              agentPrice,
              clientPrice,
            }
          : rate
      )
    );

    // Reset editing state
    setEditingId(null);

    // Show success message
    toast({
      title: 'Rates Updated',
      description: 'The lottery rates have been updated successfully',
    });

    // In a real app, you would save this to your backend
    // saveRatesToBackend(rates)
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (field: 'agentPrice' | 'clientPrice', value: string) => {
    setEditValues({
      ...editValues,
      [field]: value,
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Lottery Rates</h2>
        <Button variant='outline'>Export Rates</Button>
      </div>

      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-1/3'>Lot Group</TableHead>
              <TableHead className='w-1/3'>Agent Price</TableHead>
              <TableHead className='w-1/3'>Client Price</TableHead>
              <TableHead className='w-24'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className='font-medium'>{rate.name}</TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      value={editValues.agentPrice}
                      onChange={(e) =>
                        handleChange('agentPrice', e.target.value)
                      }
                      className='w-24 bg-blue-500 text-white font-bold'
                    />
                  ) : (
                    <div className='bg-blue-500 text-white font-bold p-2 rounded w-24 text-center'>
                      {rate.agentPrice.toFixed(2)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      value={editValues.clientPrice}
                      onChange={(e) =>
                        handleChange('clientPrice', e.target.value)
                      }
                      className='w-24 bg-green-500 text-white font-bold'
                    />
                  ) : (
                    <div className='bg-green-500 text-white font-bold p-2 rounded w-24 text-center'>
                      {rate.clientPrice.toFixed(2)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <div className='flex space-x-2'>
                      <Button size='sm' onClick={() => handleSave(rate.id)}>
                        Save
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleEdit(rate)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
