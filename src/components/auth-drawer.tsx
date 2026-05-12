import type React from 'react';

import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Smartphone, Lock, User, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OtpInput } from '@/components/otp-input';
import { ErrorDialog } from './error-dialog';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { toast } from 'sonner';
import { TENANT_APP_NAME, TENANT_REFERRAL_SUPPORTED } from '@/config/tenant';
// import { UserService } from '@/services/UserService';

interface AuthDrawerProps {
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
  showForgotPasswordInitially?: boolean;
  initialReferralCode?: string;
  initialMobileNumber?: string;
}

export function AuthDrawer({ onClose, defaultTab = 'login', showForgotPasswordInitially = false, initialReferralCode = '', initialMobileNumber }: AuthDrawerProps) {
  const { login, signup, verifyOtp, resendOtp } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);

  // Login state
  const [loginMobileNumber, setLoginMobileNumber] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Signup state
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Parse referral code from URL query parameters or initial prop
  useEffect(() => {
    if (!TENANT_REFERRAL_SUPPORTED) {
      setReferralCode('');
      return;
    }
    if (initialReferralCode) {
      setReferralCode(initialReferralCode);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const referralParam = urlParams.get('referral') || urlParams.get('ref');
      if (referralParam) {
        setReferralCode(referralParam);
      }
    }
  }, [initialReferralCode]);

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(showForgotPasswordInitially);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      // For now, bypass validation and just simulate a successful login
      const params = {
        mobileNumber: loginMobileNumber,
        password: loginPassword,
      };
      const result = await login(params);

      if (result.success) {
        onClose();
        toast.success('Login successful');
      } else {
        toast.error(result?.message?.[0] || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Login failed'
          : 'Login failed'
      );
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);
    const payload = {
      name: username,
      password: password,
      mobileNumber: mobileNumber,
      role: 0,
      referralCode: TENANT_REFERRAL_SUPPORTED ? referralCode : '',
    };
    const data = await signup(payload);
    if (data.success) {
      setIsSignupLoading(false);
      toast.success('Verify OTP');
      setShowOtpInput(true);
    } else {
      setIsSignupLoading(false);
      toast.error(data?.message);
    }
  };
  const handleVerifyOtp = async () => {
    setIsSignupLoading(true);

    try {
      // OTP verification
      const payload = {
        mobileNumber: mobileNumber,
        otp: otp,
      };
      const result = await verifyOtp(payload);
      if (result.success) {
        onClose();
      } else {
        setOtp('');
        toast.error(result.message || 'OTP verification failed');
      }
    } catch (error) {
      setOtp('');
      console.error('OTP verification error:', error);
      toast.error(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'OTP verification failed'
          : 'OTP verification failed'
      );
    } finally {
      setIsSignupLoading(false);
    }
  };
  const handleResendOtp = async () => {
    setIsSignupLoading(true);
    try {
      // Resend OTP
      const result = await resendOtp(mobileNumber);
      if (result.success) {
        toast.success(result.message || 'OTP resent successfully');
        setOtp(''); // Clear previous OTP
      } else {
        toast.error(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message || 'Failed to resend OTP'
          : 'Failed to resend OTP'
      );
    } finally {
      setIsSignupLoading(false);
    }
  };

  // reset flow is handled by ResetPasswordForm

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center p-4 border-b'>
        <Button variant='ghost' size='icon' onClick={onClose} className='mr-2'>
          <ArrowLeft className='h-5 w-5' />
          <span className='sr-only'>Back</span>
        </Button>
        <h1 className='text-xl font-bold'>Account</h1>
      </div>

      <div className='flex-1 p-4 overflow-y-auto'>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2 mb-8'>
            <TabsTrigger value='login'>Login</TabsTrigger>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value='login'>
            {showForgotPassword ? (
              <div className='space-y-6'>
                <ResetPasswordForm mobileNumber={initialMobileNumber} onSuccess={() => setShowForgotPassword(false)} />
                <div className='text-center'>
                  <Button
                    variant='link'
                    type='button'
                    className='text-primary hover:underline text-sm'
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Mobile Number</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <Smartphone className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <div className='absolute inset-y-0 left-10 flex items-center pointer-events-none'>
                      <span className='text-muted-foreground'>+91</span>
                    </div>
                    <Input
                      type='tel'
                      pattern='[6-9][0-9]{9}'
                      value={loginMobileNumber}
                      required
                      onChange={(e) => setLoginMobileNumber(e.target.value)}
                      className='pl-20'
                      placeholder='Enter 10-digit number'
                      minLength={10}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Password</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <Lock className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <Input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      required
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className='pl-10 pr-10'
                      placeholder='Enter your password'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 flex items-center pr-3'
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className='h-5 w-5 text-muted-foreground' />
                      ) : (
                        <Eye className='h-5 w-5 text-muted-foreground' />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6'
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? 'Logging in...' : 'Login'}
                </Button>

                <div className='text-center'>
                  <Button
                    variant='link'
                    className='text-primary hover:underline text-sm'
                    type='button'
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          <TabsContent value='signup'>
            {!showOtpInput ? (
              <form onSubmit={handleGetOtp} className='space-y-6'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Username</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <User className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <Input
                      type='text'
                      value={username}
                      required
                      onChange={(e) => setUsername(e.target.value)}
                      className='pl-10'
                      placeholder='Enter your username'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Mobile Number</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <Smartphone className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <div className='absolute inset-y-0 left-10 flex items-center pointer-events-none'>
                      <span className='text-muted-foreground'>+91</span>
                    </div>
                    <Input
                      type='tel'
                      pattern='[6-9][0-9]{9}'
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className='pl-20'
                      required
                      placeholder='Enter 10-digit number'
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Password</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <User className='h-5 w-5 text-muted-foreground' />
                    </div>
                    <Input
                      type='password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='pl-10'
                      placeholder='Enter your password'
                    />
                  </div>
                </div>

                {TENANT_REFERRAL_SUPPORTED ? (
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Referral Code (Optional)</label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <Gift className='h-5 w-5 text-muted-foreground' />
                      </div>
                      <Input
                        type='text'
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className='pl-10'
                        placeholder='Enter referral code (optional)'
                      />
                    </div>
                  </div>
                ) : null}

                <Button
                  type='submit'
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6'
                  disabled={isSignupLoading}
                >
                  {isSignupLoading ? 'Sending OTP...' : 'Get OTP'}
                </Button>
              </form>
            ) : (
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <label className='text-sm font-medium block text-center'>
                    Enter the 4-digit OTP sent to +91 {mobileNumber}
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderInput={(props) => (
                      <Input {...props} className='text-center' />
                    )}
                  />
                  <p className='text-xs text-muted-foreground text-center'>
                    Didn't receive the OTP?{' '}
                    <button
                      type='button'
                      className='text-primary hover:underline'
                      onClick={handleResendOtp}
                    >
                      Resend
                    </button>
                  </p>
                </div>

                <Button
                  type='button'
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6'
                  disabled={isSignupLoading || otp.length !== 4}
                  onClick={handleVerifyOtp}
                >
                  {isSignupLoading ? 'Verifying...' : 'Sign Up'}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Error Dialog */}
        <ErrorDialog
          isOpen={!!error}
          onClose={() => setError(null)}
          title='Error'
          message={error || ''}
        />
        {/* Welcome Banner */}
        <div className='mt-8 p-4 bg-gradient-to-r from-primary to-pink-500 rounded-lg text-center'>
          <h3 className='text-lg font-bold text-white'>
            Welcome to {TENANT_APP_NAME}
          </h3>
          <p className='text-white/80 text-sm'>
            Win big with our exciting games!
          </p>
        </div>
      </div>
    </div>
  );
}
