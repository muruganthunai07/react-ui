import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AdminService } from '@/services/AdminService';
import { useToast } from '@/hooks/use-toast';
import { Save, UserX, UserCheck } from 'lucide-react';
import type { AllUsersDto } from '@/types/api';
import rolesData from '@/data/roles-data.json';

interface RolesData {
  [key: string]: {
    isAdmin: boolean;
    role: string;
    screens: string[];
  };
}

export function UserEditDialog({ user, onUserUpdated, icon }: { user: AllUsersDto, onUserUpdated?: () => void, icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);
  const [role, setRole] = useState(user.role || 'User');
  const [loading, setLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [isActive, setIsActive] = useState(user.isActive !== false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setLoading(true);

    const roleId = Object.keys(rolesData).find(
      (key) => (rolesData as RolesData)[key].role === role
    );

    try {
      if (!roleId) {
        toast({ title: 'Invalid role', description: 'Selected role is not valid.', variant: 'destructive' });
        return;
      }
      await AdminService.updateUser({
        userId: user.id,
        name,
        mobileNumber,
        role: parseInt(roleId, 10),
      });
      toast({ title: 'User updated successfully', description: 'The user details have been updated.' });
      setOpen(false);
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch {
      toast({ title: 'Failed to update user', description: 'There was an error updating the user.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockOrActivate = async () => {
    setBlockLoading(true);
    try {
      if (isActive) {
        await AdminService.deactivateUser(user.id);
        toast({ title: 'User Blocked', description: 'The user has been blocked.' });
        setIsActive(false);
      } else {
        await AdminService.activateUser(user.id);
        toast({ title: 'User Activated', description: 'The user has been activated.' });
        setIsActive(true);
      }
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch {
      toast({ title: 'Action failed', description: 'Could not update user status.', variant: 'destructive' });
    } finally {
      setBlockLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='w-full'>
          {icon}
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>Update user details and actions</DialogDescription>
        <div className="space-y-4">
  <div className="flex items-center justify-between gap-4">
    <div className="w-32 font-semibold">Client ID</div>
    <Input value={user.id} disabled className="bg-muted flex-1" />
  </div>

  <div className="flex items-center justify-between gap-4">
    <div className="w-32 font-semibold">Client Name</div>
    <Input value={name} onChange={e => setName(e.target.value)} className="flex-1" />
  </div>

  <div className="flex items-center justify-between gap-4">
    <div className="w-32 font-semibold">+91</div>
    <Input value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="flex-1" />
  </div>

  <div className="flex items-center justify-between gap-4">
    <div className="w-32 font-semibold">User Level</div>
    <div className="flex-1">
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(rolesData).map((r) => (
            <SelectItem key={r.role} value={r.role}>{r.role}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  <div className="flex items-center justify-between gap-4">
    <div className="w-32 font-semibold">Balance</div>
    <Input value={user.totalBalance} disabled className="bg-muted flex-1" />
  </div>
</div>


        <DialogFooter className='flex flex-col gap-2 mt-4'>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className='flex items-center justify-center bg-purple-800 hover:bg-purple-900 text-white w-full'
          >
            <Save className='mr-2 h-4 w-4' /> Update User
          </Button>
        
          <Button
            onClick={handleBlockOrActivate}
            disabled={blockLoading}
            className={`flex items-center justify-center w-full ${isActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            variant={isActive ? 'destructive' : 'default'}
          >
            {isActive
              ? (<><UserX className='mr-2 h-4 w-4' />{blockLoading ? 'Blocking...' : 'Block User'}</>)
              : (<><UserCheck className='mr-2 h-4 w-4' />{blockLoading ? 'Activating...' : 'Activate User'}</>)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 