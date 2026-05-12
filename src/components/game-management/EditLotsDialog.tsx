import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { AllLots, PlayableLots } from '@/types/api';
import { gameService } from '@/services/game.service';
import { toast } from 'sonner';

interface EditLotsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameModeId: number;
  allLots: AllLots[];
  playableLots: PlayableLots[];
  onUpdated: () => void;
}

export function EditLotsDialog({ open, onOpenChange, gameModeId, allLots, playableLots, onUpdated }: EditLotsDialogProps) {
  const [selectedLots, setSelectedLots] = useState<number[]>([]);
//   const [selectedLotTypes, setSelectedLotTypes] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedLots(playableLots.map(lot => lot.id));
  }, [playableLots]);

  const handleToggleLot = (lotId: number) => {
    setSelectedLots((prev) =>
      prev.includes(lotId) ? prev.filter((id) => id !== lotId) : [...prev, lotId]
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await gameService.updateGameMode(gameModeId, { PlayableLotTypeIds: selectedLots });
      toast.success('Playable lots updated successfully');
      onOpenChange(false);
      onUpdated();
    } catch {
      const errorMsg = 'Failed to update lots';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Playable Lots</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {allLots.map((lot) => (
            <label key={lot.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={selectedLots.includes(lot.id)} onCheckedChange={() => handleToggleLot(lot.id)} />
              <span>{lot.name}</span>
            </label>
          ))}
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 