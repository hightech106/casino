export interface IKeno {
  amount: number | string;
  selected: number[];
}

export type ApiContextType = {
  initialize: () => Promise<any>;
  register: (data: any) => Promise<any>;
  loginApi: (data: string, callback_url: string) => Promise<any>;
  getUserHisotryApi: () => Promise<any>;
  playKenoApi: (data: IKeno) => Promise<any>;
  getKenoHistoryApi: () => Promise<any>;
};
