'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useNavbar } from '@/contexts/navbar-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { financeService } from '@/services/finance.service';
import MarqueeText from '@/components/ui/marquee';
import { TENANT_APP_NAME } from '@/config/tenant';

export default function WithdrawPage() {
  const router = useNavigate();
  const { toast } = useToast();
  const { user, refreshBalance } = useAuth();
  const { hideNavbar } = useNavbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    accountType: '',
    PaymentDetails: '',
    notes: '',
  });

  // Hide navbar when component mounts
  useEffect(() => {
    hideNavbar();
  }, [hideNavbar]);

  const wonAmount = user?.userBalance?.winningBalance || 0;
  const totalBalance = user?.userBalance?.totalBalance || 0;
  const withdrawableAmount = Math.min(wonAmount, totalBalance);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0 || !formData.accountType || !formData.PaymentDetails) {
      toast({
        title: 'Missing information',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (Number.parseFloat(formData.amount) > withdrawableAmount) {
      toast({
        title: 'Invalid amount',
        description: `You can only withdraw up to ₹${withdrawableAmount}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      amount: Number.parseFloat(formData.amount),
      accountType: formData.accountType,
      paymentDetails: formData.PaymentDetails,
      notes: formData.notes,
    };
    try {
      // Simulate API call
      await financeService.withdraw(payload);
      await refreshBalance();
      toast({
        title: 'Withdrawal request submitted',
        description:
          'Your withdrawal request has been submitted for processing',
      });

      // Delay navigation to ensure context is stable
      setTimeout(() => {
        router('/');
      }, 100);
    } catch {
      toast({
        title: 'Error',
        description: 'There was an error submitting your withdrawal request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <MarqueeText text='You will be charged 3% of your withdrawal amount as a processing fee.' />
    <div className='container max-w-md mx-auto px-4 py-8'>
      <Button
        variant='ghost'
        className='mb-4 pl-0 flex items-center gap-1'
        onClick={() => router(-1)}
      >
        <ArrowLeft className='h-4 w-4' />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Withdraw Funds</CardTitle>
          <CardDescription>
            Withdraw your winnings from {TENANT_APP_NAME}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className='mb-6 bg-amber-100 dark:bg-amber-950/30 dark:text-amber-900 dark:text-amber-300 dark:border-amber-800'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              You can only withdraw your winnings (₹{wonAmount}). Newly
              deposited amounts cannot be withdrawn.
            </AlertDescription>
          </Alert>

          <div className='flex justify-between items-center mb-6 p-3 bg-muted rounded-md'>
            <span>Available for withdrawal:</span>
            <span className='font-bold text-lg'>₹{withdrawableAmount}</span>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount (₹)</Label>
              <Input
                id='amount'
                name='amount'
                type='number'
                placeholder='Enter amount'
                value={formData.amount}
                onChange={handleInputChange}
                max={withdrawableAmount}
                required
                min={1}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='accountType'>Payment Method</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) =>
                  handleSelectChange('accountType', value)
                }
              >
                <SelectTrigger id='accountType'>
                  <SelectValue placeholder='Select payment method' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='upi'>UPI</SelectItem>
                  <SelectItem value='bank'>Bank Transfer</SelectItem>
                  <SelectItem value='paytm'>Paytm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='PaymentDetails'>
                {formData.accountType === 'upi'
                  ? 'UPI ID'
                  : formData.accountType === 'bank'
                  ? 'Bank Account Details'
                  : formData.accountType === 'paytm'
                  ? 'Paytm Number'
                  : 'Account Details'}
              </Label>
              <Textarea
                id='PaymentDetails'
                name='PaymentDetails'
                placeholder={
                  formData.accountType === 'upi'
                    ? 'Enter your UPI ID'
                    : formData.accountType === 'bank'
                    ? 'Enter account number, IFSC, account holder name'
                    : formData.accountType === 'paytm'
                    ? 'Enter your Paytm registered mobile number'
                    : 'Enter your payment details'
                }
                value={formData.PaymentDetails}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Additional Notes (Optional)</Label>
              <Textarea
                id='notes'
                name='notes'
                placeholder='Any additional information'
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting || withdrawableAmount <= 0}
            >
              {isSubmitting ? 'Processing...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex flex-col items-start text-sm text-muted-foreground'>
          <p>
            Note: Withdrawals are processed within 24 hours during business
            days.
          </p>
          <p className='mt-1'>
            Only winnings can be withdrawn, not newly deposited amounts.
          </p>
        </CardFooter>
      </Card>
    </div>
    </>
  );
}

