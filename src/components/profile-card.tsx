import type React from 'react';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { Copy, Edit, Gift, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function ProfileCard() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.name || '',
    email: user?.email || '',
  });

  // Generate a referral code based on username
  const referralCode = user
    ? `${user.name
        .replace(/\s+/g, '')
        .substring(0, 6)
        .toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`
    : '';

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    updateUserProfile({
      username: formData.username,
      email: formData.email,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
    });
    setIsEditing(false);
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    });
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Profile Information</CardTitle>
        <div className='flex gap-2'>
          {isEditing ? (
            <>
              <Button variant='outline' size='sm' onClick={handleCancelEdit}>
                <X className='mr-2 h-4 w-4' />
                Cancel
              </Button>
              <Button size='sm' onClick={handleSaveProfile}>
                <Save className='mr-2 h-4 w-4' />
                Save
              </Button>
            </>
          ) : (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsEditing(true)}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-16 w-16 border-2 border-primary'>
            <AvatarFallback className='bg-primary text-primary-foreground text-xl'>
              {user && user.username
                ? user.username.charAt(0).toUpperCase()
                : ''}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className='text-lg font-medium'>{user.username}</h3>
            <p className='text-sm text-muted-foreground'>
              Member since {user && user.joinDate ? user.joinDate : 'N/A'}
            </p>
          </div>
        </div>

        {isEditing ? (
          <div className='grid gap-4 pt-4'>
            <div className='grid gap-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        ) : (
          <div className='grid gap-4 pt-4'>
            <div className='grid gap-1'>
              <Label className='text-muted-foreground'>Username</Label>
              <p>{user.username}</p>
            </div>
            <div className='grid gap-1'>
              <Label className='text-muted-foreground'>Email</Label>
              <p>{user.email || 'Not provided'}</p>
            </div>
            <div className='grid gap-1'>
              <Label className='text-muted-foreground'>Mobile</Label>
              <p>+91 {user.mobileNumber}</p>
            </div>
            <div className='grid gap-1'>
              <Label className='text-muted-foreground flex items-center gap-2'>
                <Gift className='h-4 w-4' /> Referral Code
              </Label>
              <div className='flex items-center gap-2'>
                <Input
                  value={referralCode}
                  readOnly
                  className='bg-muted font-medium'
                />
                <Button
                  variant='outline'
                  size='icon'
                  onClick={copyReferralCode}
                >
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Share this code with friends to earn rewards!
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className='border-t pt-4'>
        <p className='text-xs text-muted-foreground'>
          Your profile information is used to personalize your experience and is
          not shared with third parties.
        </p>
      </CardFooter>
    </Card>
  );
}
