// services/api.ts
import axios from 'axios';
import { startLoading, completeLoading } from '../utils/LoadingBarController';
import { toast } from 'sonner';
const apiUrl = import.meta.env.VITE_BASE_URL;
const API = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
API.interceptors.request.use(
  (config) => {
    startLoading();

    const latestToken = sessionStorage.getItem('token');
    if (latestToken) {
      config.headers.Authorization = `Bearer ${latestToken}`;
    }

    return config;
  },
  (error) => {
    completeLoading();
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    completeLoading();
    return response;
  },
  (error) => {
    completeLoading();
    console.error('API Error:', error);
    if (error.status === 401) {
      localStorage.clear();
      window.location.replace('/?login');
      toast.error('Session Expired! Please Login');
    }
    return Promise.reject(error);
  }
);

export default API;
