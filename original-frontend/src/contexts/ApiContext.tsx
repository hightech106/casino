import React, { createContext } from 'react';
import axios from 'src/utils/axios';
import { dispatch } from 'src/store';
import { userAction } from 'src/store/reducers/auth';
import {
  ApiContextType,
  IKeno,
} from './type';

const ApiContext = createContext<ApiContextType | null>(null);
/* eslint-disable */
export const ApiProvider = ({ children }: { children: React.ReactElement }) => {
  // auth

  const initialize = async () => {
    const res = await axios.get('auth/me');
    if (!res?.data) return;
    return dispatch(userAction(res.data));
  };

  const loginApi = async (data: string, callback_url: string) => {
    return await axios.post('auth/login', { token: data, callback_url });
  };

  const register = async (data: any) => {
    return await axios.post('auth/register', data);
  };

  const getUserHisotryApi = async () => {
    return await axios.get('user/history');
  };

  // Keno

  const playKenoApi = async (data: IKeno) => {
    return await axios.post('game/keno/play', data);
  };

  const getKenoHistoryApi = async () => {
    return await axios.get('game/keno/history');
  };

  return (
    <ApiContext.Provider
      value={{
        initialize,
        loginApi,
        register,
        getUserHisotryApi,
        playKenoApi,
        getKenoHistoryApi,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
