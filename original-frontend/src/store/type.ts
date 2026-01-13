export interface UserProfile {
  _id: string;
  userId: string;
  email: string;
  username: string;
  balance: number;
  first_name: string;
  last_name: string;
  currency: string;
  currencyIcon: string;
  avatar: string;
  callback_url: string;
  status: string;
  createdAt: string;
}

export interface InitialAuthContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  token?: string | undefined;
  user: UserProfile;
  balance: number;
  realBalance: number;
  baseUrl: string;
}
