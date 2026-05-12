import type React from 'react';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Smartphone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { ErrorDialog } from '@/components/error-dialog';
import { toast } from 'sonner';
import { TENANT_APP_NAME } from '@/config/tenant';

interface LoginFormProps {
  onSuccess?: () => void;
  onSignupClick?: () => void;
}

export function LoginForm({ onSuccess, onSignupClick }: LoginFormProps) {
  const { login } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!mobileNumber) {
      setError('Please enter your mobile number');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    // Special case for our test credentials
    if (mobileNumber === '1234567890' || mobileNumber === '0000000000') {
      // Skip validation for test credentials
    }
    // For admin login, we'll skip the mobile number validation
    else if (mobileNumber !== 'admin' && !/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    const params = {
      mobileNumber: mobileNumber,
      password: password,
    };
    try {
      const result = await login(params);

      if (result.success) {
        onSuccess?.();
        setMobileNumber('');
        setPassword('');
        toast.success('Login successful!');
      }
      else{
        toast.error(result?.message?.[0] || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: string }).message
          : undefined;
      toast.error(errorMessage || 'Login failed. Please try again.');
      setError('An error occurred. Please try again.');
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
        <h1 className='text-xl font-bold text-white ml-2'>Login</h1>
      </div>

      <div className='flex-1 bg-white/10 backdrop-blur-md border-0 shadow-xl rounded-lg p-6'>
        <form onSubmit={handleLogin} className='space-y-6'>
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
                onChange={(e) => setMobileNumber(e.target.value)}
                className='pl-20 bg-gray-800 border-gray-700 text-white'
                placeholder='Enter 10-digit number'
                maxLength={10}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-300'>
              Password
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pl-10 pr-10 bg-gray-800 border-gray-700 text-white'
                placeholder='Enter your password'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 flex items-center pr-3'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-400' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
          </div>

          <Button
            type='submit'
            className='w-full bg-primary hover:bg-primary/90 text-black font-bold py-6'
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div className='text-center'>
            <Button
              variant='link'
              className='text-primary hover:underline text-sm'
            >
              Forgot Password?
            </Button>
          </div>
        </form>

        <div className='mt-12'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-700'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-gray-900 text-gray-400'>
                Don't have an account?
              </span>
            </div>
          </div>

          <div className='mt-6'>
            <Button
              variant='outline'
              className='w-full border-primary text-primary hover:bg-primary/10'
              onClick={onSignupClick}
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Dynamic Banner */}
        <div className='mt-8 p-4 bg-gradient-to-r from-primary to-pink-500 rounded-lg text-center'>
          <h3 className='text-lg font-bold text-white'>
            Welcome to {TENANT_APP_NAME}
          </h3>
          <p className='text-white/80 text-sm'>
            Win big with our exciting games!
          </p>
        </div>
      </div>

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={!!error}
        onClose={() => setError(null)}
        title='Login Failed'
        message={error || ''}
      />
    </div>
  );
}
