/**
 * Axios instance configuration with request/response interceptors for authentication and error handling.
 * Automatically attaches auth tokens from Redux store and handles 401 errors by logging out users.
 * Note: All API errors are displayed via toast notifications, and 401 responses trigger automatic logout.
 */
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
// config
import { API_URL } from 'src/config-global';
import { store } from 'src/store';
import { Logout } from 'src/store/reducers/auth';
import toast from 'react-hot-toast';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(
  (config: any) => {
    config.baseURL = API_URL;
    const state = store.getState() as any;
    const accessToken = state.auth.token;
    if (accessToken) {
      config.headers.authorization = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    if (response && response.status === 400) {
      console.error(response.data);
      toast.error(response.data?.error || response.data?.message || response.data);
    } else if (response && response.status === 401) {
      // Don't logout on deposit confirmation errors - these are validation errors, not auth errors
      const isDepositEndpoint = config?.url?.includes('/s-deposit') || 
                                config?.url?.includes('/solana/check-deposits') ||
                                config?.url?.includes('/solana/deposit-address') ||
                                config?.url?.includes('/check-deposits');
      
      // For deposit endpoints, always treat as validation error unless it's explicitly an auth error
      // The backend should return 200 with error details, but if it returns 401, don't logout
      if (isDepositEndpoint) {
        // This is a deposit endpoint - show error but don't logout
        const errorMsg = response.data?.message || response.data?.error || 'Deposit check failed';
        toast.error(errorMsg);
        console.warn('401 from deposit endpoint (non-critical):', errorMsg);
      } else {
        // Real authentication error - logout
        console.error('401 Unauthorized - logging out user');
        store.dispatch(Logout());
      }
    } else if (response && response.status === 402) {
      toast.error(response.data?.error || response.data);
    } else if (response && response.status === 500) {
      toast.error(response.data?.error || response.data);
    }else if (response && response.status === 404) {
      toast.error('API not found');
    } else {
      toast.error(response?.data || 'API error');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
