import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AdminService } from '@/services/AdminService';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import type { AllUsersDto } from '@/types/api';

export function AdminRechargeDialog({ user, onUserUpdated, icon }: { user: AllUsersDto, onUserUpdated?: () => void, icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRecharge = async () => {
    setLoading(true);
    try {
      await AdminService.adminRecharge({
        userId: user.id,
        amount: parseFloat(amount),
      });
      toast({ title: 'Recharge successful', description: 'The user balance has been updated.' });
      setOpen(false);
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error: any) {
      const errorMessages = error?.errors?.join(', ') || 'An unexpected error occurred.';
      toast({ title: 'Recharge failed', description: errorMessages, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full'>
          {icon}
          Admin Recharge
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogTitle>Admin Recharge</DialogTitle>
        <DialogDescription>Recharge user account manually.</DialogDescription>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="w-32 font-semibold">Client ID</div>
            <Input value={user.id} disabled className="bg-muted flex-1" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="w-32 font-semibold">Client Name</div>
            <Input value={user.name} disabled className="bg-muted flex-1" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="w-32 font-semibold">Amount</div>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1" placeholder="Enter amount" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="w-32 font-semibold">Transaction ID</div>
            <Input value={transactionId} onChange={e => setTransactionId(e.target.value)} className="flex-1" placeholder="Optional transaction ID" />
          </div>
        </div>
        <DialogFooter className='flex flex-col gap-2 mt-4'>
          <Button
            onClick={handleRecharge}
            disabled={loading}
            className='flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-full'
          >
            <Save className='mr-2 h-4 w-4' /> {loading ? 'Recharging...' : 'Recharge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 