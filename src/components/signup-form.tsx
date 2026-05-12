import type React from 'react';

import { useState } from 'react';
import { ArrowLeft, User, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { ErrorDialog } from '@/components/error-dialog';
import { OtpInput } from '@/components/otp-input';
import { toast } from 'sonner';
import type { UserRegisterRequest, VerifyOtp } from '@/types/api';

interface SignupFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

interface AuthResponse {
  success: boolean;
  message: string[];
}

export function SignupForm({ onSuccess, onLoginClick }: SignupFormProps) {
  const { signup, verifyOtp } = useAuth();
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    const payload: UserRegisterRequest = {
      name: username,
      mobileNumber: mobileNumber,
      password: password,
      role: 0,
    };
    const result = (await signup(payload)) as AuthResponse;

    if (result?.success) {
      setShowOtpInput(true);
      setIsLoading(false);
      toast.success('OTP sent successfully! Please check your messages.');
    } else {
      toast.error(result?.message?.[0] || 'Signup failed');
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    const payload: VerifyOtp = {
      mobileNumber: mobileNumber,
      otp: otp,
    };
    try {
      const result = await verifyOtp(payload);
      if (result.success) {
        toast.success('OTP verified successfully! You are now registered.');
        setIsLoading(false);
        onSuccess?.();
      } else {
        setOtpAttempts((prev) => prev + 1);

        if (otpAttempts >= 2) {
          // Reset after 3 failed attempts
          setShowOtpInput(false);
          setOtp('');
          setOtpAttempts(0);
          toast.error('Too many failed attempts. Please try again.');
        } else {
          setOtpAttempts((prev) => prev + 1);

          if (otpAttempts >= 2) {
            // Reset after 3 failed attempts
            setShowOtpInput(false);
            setOtp('');
            setOtpAttempts(0);
            toast.error('Too many failed attempts. Please try again.');
          } else {
            setOtp('');
            toast.error(result?.message?.[0] || 'Invalid OTP');
          }
        }
      }
    } catch (error) {
      setOtp('');
      console.error('OTP verification error:', error);
      toast.error('An error occurred while verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-full flex flex-col bg-gradient-to-b from-black to-gray-900 p-4'>
      <div className='flex items-center mb-8'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onSuccess}
          className='text-white'
        >
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <h1 className='text-xl font-bold text-white ml-2'>Sign Up</h1>
      </div>

      <div className='flex-1 bg-white/10 backdrop-blur-md border-0 shadow-xl rounded-lg p-6'>
        <form onSubmit={handleGetOtp} className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-300'>
              Username
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <User className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='text'
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                className='pl-10 bg-gray-800 border-gray-700 text-white'
                placeholder='Enter your username'
                disabled={showOtpInput}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-300'>
              Mobile Number
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Smartphone className='h-5 w-5 text-gray-400' />
              </div>
              <div className='absolute inset-y-0 left-10 flex items-center pointer-events-none'>
                <span className='text-gray-400'>+91</span>
              </div>
              <Input
                type='tel'
                pattern='[6-9][0-9]{9}'
                value={mobileNumber}
                required
                onChange={(e) => setMobileNumber(e.target.value)}
                className='pl-20 bg-gray-800 border-gray-700 text-white'
                placeholder='Enter 10-digit number'
                maxLength={10}
                disabled={showOtpInput}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-300'>
              Password
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <User className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className='pl-10 bg-gray-800 border-gray-700 text-white'
                placeholder='Enter your username'
                disabled={showOtpInput}
              />
            </div>
          </div>

          {!showOtpInput && (
            <Button
              type='submit'
              className='w-full bg-primary hover:bg-primary/90 text-black font-bold py-6'
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Get OTP'}
            </Button>
          )}
        </form>

        {showOtpInput && (
          <div className='mt-8 space-y-6'>
            <div className='space-y-4'>
              <label className='text-sm font-medium text-gray-300 block text-center'>
                Enter the 4-digit OTP sent to +91 {mobileNumber}
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderInput={(props) => (
                  <Input
                    {...props}
                    className='bg-gray-800 border-gray-700 text-white text-center'
                  />
                )}
              />
              <p className='text-xs text-gray-400 text-center'>
                Didn't receive the OTP?{' '}
                <button
                  type='button'
                  className='text-primary hover:underline'
                  onClick={() => setShowOtpInput(false)}
                >
                  Resend
                </button>
              </p>
            </div>

            <Button
              type='button'
              className='w-full bg-primary hover:bg-primary/90 text-black font-bold py-6'
              disabled={isLoading || otp.length !== 4}
              onClick={handleVerifyOtp}
            >
              {isLoading ? 'Verifying...' : 'Sign Up'}
            </Button>
          </div>
        )}

        <div className='mt-12'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-700'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-gray-900 text-gray-400'>
                Already have an account?
              </span>
            </div>
          </div>

          <div className='mt-6'>
            <Button
              variant='outline'
              className='w-full border-primary text-primary hover:bg-primary/10'
              onClick={onLoginClick}
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={!!error}
        onClose={() => setError(null)}
        title='Error'
        message={error || ''}
      />
    </div>
  );
}
