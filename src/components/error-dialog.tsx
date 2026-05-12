import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function ErrorDialog({
  isOpen,
  onClose,
  title,
  message,
}: ErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-gray-900 border-gray-800 text-white'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-red-500'>
            <AlertCircle className='h-5 w-5' />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className='py-4'>{message}</div>
        <DialogFooter>
          <Button
            onClick={onClose}
            className='bg-primary hover:bg-primary/90 text-black'
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
