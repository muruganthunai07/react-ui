import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminService } from '@/services/AdminService';
import { toast } from 'sonner';

interface AddHolidayDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onHolidayAdded: () => void;
}

export function AddHolidayDialog({
  isOpen,
  onClose,
  onHolidayAdded,
}: AddHolidayDialogProps) {
  const [holidayDate, setHolidayDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await AdminService.addHoliday({ holidayDate, description });
      toast.success('Holiday added successfully');
      onHolidayAdded();
      onClose();
    } catch {
      toast.error('Failed to add holiday');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Holiday</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='holidayDate' className='text-right'>
              Date
            </Label>
            <Input
              id='holidayDate'
              type='date'
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              Description
            </Label>
            <Input
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Holiday'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 