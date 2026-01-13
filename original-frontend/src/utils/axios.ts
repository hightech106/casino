/**
 * Axios instance configuration with interceptors for authentication and error handling.
 * Automatically adds authorization headers from Redux store and handles 401 errors by logging out users.
 * Note: All API errors are displayed via toast notifications, and 401 responses trigger automatic logout.
 */
import axios, { AxiosRequestConfig } from 'axios';
import { API_URL } from 'src/config-global';
import toast from 'react-hot-toast';
import { store } from 'src/store';
import { logoutAction } from 'src/store/reducers/auth';
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
    const { response } = error;
    if (response && response.status === 400) {
      console.error(response.data);
      toast.error(response.data?.message || response.data);
    } else if (response && response.status === 401) {
      store.dispatch(logoutAction());
    } else if (response && response.status === 402) {
      toast.error(response.data?.message || response.data);
    } else if (response && response.status === 403) {
      store.dispatch(logoutAction());
    } else if (response && response.status === 500) {
      toast.error(response.data?.message || response.data);
    } else if (response && response.status === 404) {
      toast.error('API not found');
    } else {
      toast.error(response?.data || 'API error');
    }
  }
);

export default axiosInstance;
