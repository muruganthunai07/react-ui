import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { UserService } from '@/services/UserService';
import { financeService } from '@/services/finance.service';
import { TENANT_USER_COOKIE_NAME } from '@/config/tenant';
import type {
  UserLoginRequest,
  UserRegisterRequest,
  VerifyOtp,
} from '@/types/api';
import rolesData from '../data/roles-data.json';

type User = {
  id: string;
  name: string;
  isAdmin?: boolean;
  mobileNumber?: number;
  joinDate?: string;
  username?: string;
  email?: string;
  avatar?: string;
  userBalance: {
    totalBalance: number;
    winningBalance: number;
  };
  role: string;
  preferences?: {
    notifications?: boolean;
    marketingEmails?: boolean;
  };
  referralCode?: string;
};

type UserType = { 
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (
    params: UserLoginRequest
  ) => Promise<{ success: boolean; message: string[] }>;
  verifyOtp: (
    payload: VerifyOtp
  ) => Promise<{ success: boolean; message: string[] }>;
  verifyOtpForReset: (
    payload: VerifyOtp
  ) => Promise<{ success: boolean; message: string[] }>;
  signup: (
    body: UserRegisterRequest
  ) => Promise<{ success: boolean; message: string[] }>;
  logout: () => void;
  resendOtp: (
    mobileNumber: string
  ) => Promise<{ success: boolean; message: string[] }>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  updateUserProfile: (user: UserType) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  refreshBalance: () => Promise<void>;
  updateBalance: (balance: { totalBalance: number; winningBalance: number }) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const {clearCart} = useCart();
  const router = useNavigate();

  const isAuthenticated = Boolean(user);

  const isAdmin = isAuthenticated && Boolean(user?.isAdmin);
  // Dynamically get the Agent role id from rolesData
  const agentRoleId = Object.keys(rolesData).find(
    (key) => (rolesData as Record<string, { role: string }>)[key].role === 'Agent'
  );
  const isAgent = isAuthenticated && user?.role == agentRoleId;

  useEffect(() => {
    const storedUser = storage.get('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      document.cookie = `${TENANT_USER_COOKIE_NAME}=${JSON.stringify({
        id: user.id,
        role: user.role,
      })}; path=/; max-age=86400`;
    } else {
      document.cookie = `${TENANT_USER_COOKIE_NAME}=; path=/; max-age=0`;
    }
  }, [user]);

  const login = async (params: UserLoginRequest) => {
    setIsLoading(true);
    try {
      const response = await UserService.userLogin(params);
      const roleInfo = (rolesData as Record<string, { isAdmin: boolean }>)[
        response.role
      ] || {
        isAdmin: false,
      };
      const loggedUser: User = {
        id: response.userId,
        name: response.name,
        username: response.name,
        isAdmin: roleInfo.isAdmin,
        mobileNumber: Number(response.mobileNumber),
        userBalance: {
          totalBalance: response.userBalance.totalBalance,
          winningBalance: response.userBalance.winningBalance,
        },
        role: response.role,
        referralCode : response.referralCode
      };
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      sessionStorage.setItem('token', response.token);
      return { success: true, message: ['Login successful'] };
    } catch (err: unknown) {
      let errorMessages: string[] = ['Login failed'];
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'errors' in err.response.data &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMessages = err.response.data.errors;
      }
      return { success: false, message: errorMessages };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (payload: VerifyOtp) => {
    setIsLoading(true);
    try {
      const response = await UserService.verifyOtp(payload);
      const roleInfo = (rolesData as Record<string, { isAdmin: boolean }>)[
        response.role
      ] || {
        isAdmin: false,
      };
      const loggedUser: User = {
        id: response.userId,
        name: response.name,
        username: response.name,
        isAdmin: roleInfo.isAdmin,
        mobileNumber: Number(response.mobileNumber),
        userBalance: {
          totalBalance: response.userBalance.totalBalance,
          winningBalance: response.userBalance.winningBalance,
        },
        role: response.role,
        referralCode: response.referralCode
      };
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      sessionStorage.setItem('token', response.token);
      return { success: true, message: ['Signup successful'] };
    } catch (err: unknown) {
      // Use ApiError model for error handling
      let errorMessages: string[] = ['OTP verification failed'];
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'errors' in err.response.data &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMessages = err.response.data.errors;
      }
      return { success: false, message: errorMessages };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (body: UserRegisterRequest) => {
    setIsLoading(true);
    try {
      await UserService.registerUser(body);
      return { success: true, message: ['Please verify OTP'] };
    } catch (err: unknown) {
      let errorMessages: string[] = ['Signup failed'];
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'errors' in err.response.data &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMessages = err.response.data.errors;
      }
      return { success: false, message: errorMessages };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (mobileNumber: string) => {
    setIsLoading(true);
    try {
      await UserService.resendOtp(mobileNumber);
      return { success: true, message: ['OTP resent successfully'] };
    } catch (err: unknown) {
      let errorMessages: string[] = ['Failed to resend OTP'];
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'errors' in err.response.data &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMessages = err.response.data.errors;
      }
      return { success: false, message: errorMessages };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpForReset = async (payload: VerifyOtp) => {
    setIsLoading(true);
    try {
      await UserService.verifyOtp(payload);
      return { success: true, message: ['OTP verified successfully'] };
    } catch (err: unknown) {
      let errorMessages: string[] = ['OTP verification failed'];
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'errors' in err.response.data &&
        Array.isArray(err.response.data.errors)
      ) {
        errorMessages = err.response.data.errors;
      }
      return { success: false, message: errorMessages };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // clearCart();
    setUser(null);
    sessionStorage.removeItem('token');
    localStorage.clear();
    router('/');
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences,
        },
      };
      setUser(updatedUser);
      storage.set('user', JSON.stringify(updatedUser));
    }
  };

  const updateUserProfile = (updatedFields: UserType) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        username: updatedFields.username,
        email: updatedFields.email,
      };
      setUser(updatedUser);
      storage.set('user', JSON.stringify(updatedUser));
    }
  };

  const refreshBalance = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const balance = await financeService.getBalance();
      const updatedUser = {
        ...user,
        userBalance: {
          totalBalance: balance.totalBalance,
          winningBalance: balance.winningBalance,
        },
      };
      setUser(updatedUser);
      storage.set('user', JSON.stringify(updatedUser));
    } catch {
      // Optionally handle error (e.g., toast)
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = (balance: { totalBalance: number; winningBalance: number }) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        userBalance: {
          totalBalance: balance.totalBalance,
          winningBalance: balance.winningBalance,
        },
      };
      setUser(updatedUser);
      storage.set('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        verifyOtp,
        verifyOtpForReset,
        logout,
        resendOtp,
        updateUserPreferences,
        updateUserProfile,
        isLoading,
        isAuthenticated,
        isAdmin,
        isAgent,
        setUser,
        refreshBalance,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
