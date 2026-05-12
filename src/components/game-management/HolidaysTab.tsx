import { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/contexts/GameContext';
import { toast } from 'sonner';
import { AdminService } from '@/services/AdminService';
import { AddHolidayDialog } from './AddHolidayDialog';

interface HolidaysTabProps {
  searchQuery: string;
}

export function HolidaysTab({ searchQuery }: HolidaysTabProps) {
  const { holidayData, getHolidays } = useGameContext();
  const [isAddHolidayDialogOpen, setIsAddHolidayDialogOpen] = useState(false);

  useEffect(() => {
    getHolidays();
  }, []);

  const deleteHoliday = async (id: number) => {
    try {
      await AdminService.deleteHoliday(id);
      toast.success('Holiday deleted successfully');
      getHolidays();
    } catch  {
      toast.error('Failed to delete holiday');
    }
  };

  const filteredHolidays = holidayData.filter(
    (holiday) =>
      holiday?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      holiday?.holidayDate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className='flex justify-end'>
        <Button onClick={() => setIsAddHolidayDialogOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Add New
        </Button>
      </div>
      <div className='rounded-md border overflow-hidden mt-4'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Holiday Name</TableHead>
                <TableHead className='hidden md:table-cell'>
                  Affected Games
                </TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHolidays.map((holiday) => (
                <TableRow key={holiday.holidayId}>
                  <TableCell>{holiday.holidayDate}</TableCell>
                  <TableCell className='font-medium'>
                    {holiday?.description}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {holiday.tenantId}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='icon'>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => deleteHoliday(holiday.holidayId)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AddHolidayDialog
        isOpen={isAddHolidayDialogOpen}
        onClose={() => setIsAddHolidayDialogOpen(false)}
        onHolidayAdded={getHolidays}
      />
    </>
  );
} 