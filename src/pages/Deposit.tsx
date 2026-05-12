'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import MarqueeText from '@/components/ui/marquee';
import { useToast } from '@/hooks/use-toast';
import { useNavbar } from '@/contexts/navbar-context';
import { financeService } from '@/services/finance.service';
import { FileService } from '@/services/FileService';
import AppInfoService from '@/services/AppInfoService';
import type { FileResponse } from '@/types/api';
import { getFileUrl } from '@/lib/utils';
import { TENANT_APP_NAME } from '@/config/tenant';

export default function DepositPage() {
  const router = useNavigate();
  const { toast } = useToast();
  const { hideNavbar } = useNavbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    transactionId: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<FileResponse[]>([]);
  const [upiId, setUpiId] = useState<string>('');

  useEffect(() => {
    hideNavbar();
    const fetchData = async () => {
      try {
        // Fetch QR codes
        const response = await FileService.getQrCodes();
        setQrCodes(response);

        // Fetch UPI ID
        const upiInfo = await AppInfoService.getAppInfo('UPIId');
        if (upiInfo && upiInfo.value) {
          setUpiId(upiInfo.value);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment information.',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, [hideNavbar, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      toast({
        title: 'Copied!',
        description: 'UPI ID copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy UPI ID', error);
      toast({
        title: 'Error',
        description: 'Failed to copy UPI ID',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0 || !formData.transactionId || !screenshot) {
      toast({
        title: 'Missing information',
        description: 'Please fill all required fields and upload a screenshot',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const depositData = new FormData();
      depositData.append('amount', formData.amount);
      depositData.append('transactionId', formData.transactionId);
      if (screenshot) {
        depositData.append('paymentScreenshot', screenshot);
      }

      await financeService.deposit(depositData);

      toast({
        title: 'Deposit request submitted',
        description: 'Your deposit request has been submitted for approval',
      });

      router('/');
    } catch (error: any) {
      // Extract error message from API response
      let errorMessage = 'There was an error submitting your deposit request';
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0];
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MarqueeText text='Recharge your account with below QR CODE or UPI ID. Minimum Recharge Amount: ₹ 20. After Payment enter your transaction id then press Confirm Payment Button.' />
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
            <CardTitle className='text-2xl'>Deposit Funds</CardTitle>
            <CardDescription>
              Add money to your {TENANT_APP_NAME} account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qrCodes.length > 0 && (
              <Carousel className='w-full max-w-xs mx-auto mb-6'>
                <CarouselContent>
                  {qrCodes.map((qr) => (
                    <CarouselItem key={qr.id}>
                      <div className='p-1'>
                        <Card>
                          <CardContent className='flex aspect-square items-center justify-center p-6'>
                            <img
                              src={getFileUrl(qr.filePath)}
                              alt={qr.fileName}
                              className='rounded-md object-contain'
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}

            {/* UPI ID Display */}
            {upiId && (
              <div className='mb-6'>
                <div className='flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border'>
                  <span className='flex-1 text-sm font-mono text-gray-700'>
                    {upiId}
                  </span>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleCopyUpiId}
                    className='shrink-0'
                  >
                    <Copy className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}

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
                  required
                  min={1}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='transactionId'>Transaction ID</Label>
                <Input
                  id='transactionId'
                  name='transactionId'
                  placeholder='Enter UPI/Bank transaction ID'
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='screenshot'>Payment Screenshot</Label>
                <div className='border border-dashed border-gray-300 rounded-lg p-4 text-center'>
                  <input
                    id='screenshot'
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={handleFileChange}
                  />
                  <Label
                    htmlFor='screenshot'
                    className='cursor-pointer flex flex-col items-center justify-center gap-2'
                  >
                    {previewUrl ? (
                      <div className='relative w-full'>
                        <img
                          src={previewUrl || '/placeholder.svg'}
                          alt='Payment screenshot'
                          className='max-h-48 mx-auto rounded-md object-contain'
                        />
                        <p className='text-sm text-muted-foreground mt-2'>
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className='h-8 w-8 text-muted-foreground' />
                        <span className='text-sm text-muted-foreground'>
                          Click to upload payment screenshot
                        </span>
                      </>
                    )}
                  </Label>
                </div>
              </div>
              <Button type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Processing...'
                  : 'Submit Deposit Request'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className='flex flex-col items-start text-sm text-muted-foreground'>
            <p>
              Note: Deposits will be processed within 30 minutes during business
              hours.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
