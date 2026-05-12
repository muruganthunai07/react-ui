import type {
  UserLoginRequest,
  UserRegisterRequest,
  VerifyOtp,
} from '@/types/api';
import API from './api';

const userLogin = async (body: UserLoginRequest) => {
  const res = await API.post('/api/Auth/login', body);
  return res.data;
};
const verifyOtp = async (body: VerifyOtp) => {
  const res = await API.post('/api/Auth/verify-otp', body);
  return res.data;
};
const registerUser = async (body: UserRegisterRequest) => {
  const res = await API.post('/api/Auth/register', body);
  return res.data;
};
const resendOtp = async (mobileNumber: string) => {
  const res = await API.post('/api/Auth/resend-otp', { mobileNumber });
  return res.data;
};
const resetPassword = async (body: { mobileNumber: string; newPassword: string }) => {
  const res = await API.post('/api/Auth/reset-password', body);
  return res.data;
};

export const UserService = {
  registerUser,
  verifyOtp,
  userLogin,
  resendOtp,
  resetPassword,
};
