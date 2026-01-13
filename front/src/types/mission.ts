export interface Mission {
  _id: string;
  title: string;
  description: string | string[];
  banner_path: string;
  steps: string[];
  type?: string;
  num: number;
  reward: number;
  min_level: number;
  eligible_users: string[] | 'ALL';
  progress: number;
  status: string;
  start_date?: string;
  expire_date?: string;
 [key: string]: any;
}

export interface Condition {
  description: string;
  completed: boolean;
}

export interface MiniGame {
  id: number;
  title: string;
  description: string;
  image: string;
  points: number;
}

export interface Badge {
  _id: string;
  name: string;
  banner_path: string;
  have: boolean;
}

export interface HomeTabProps {
  missions: Mission[];
}

export interface Level {
  _id: string;
  name: string;
  num: number;
  banner_path: string;
  have: boolean;
  min_points: number;
}

export interface MissionsTabProps {
  missions: Mission[];
  userLevel?: number;
}

export interface Tab {
  name: string;
  label: string;
  icon: string;
}

export interface UserStats {
  points: number;
  points_needed: number;
  level: number;
  levelProgress: number;
  missionsCompleted: number;
  missionsTotal: number;
  badgesCount: number;
  username: string;
  avatar?: string;
}

export interface MissionModalProps {
  open: boolean;
  onClose: () => void;
  setActiveTab?: (tab: string) => void;
  activeTab?: string;
  isLoading?: boolean;
}

export interface StoreItem {
  id: number;
  category: 'free_games' | 'kelly_bonuses' | 'free_bets';
  title: string;
  image?: string;
  tokens: number;
}

export interface ScratchFieldProps {
  onScratch: () => void;
  onScratchStart: (fieldIndex: number) => void;
  reset: number;
  photoUrl?: string;
}

export interface ScratchGameProps {
  setActiveTab?: (tab: string) => void;
  setActiveMiniGame?: (miniGame: string | null) => void;
}

export interface MiniGamesTabProps {
  setActiveTab?: (tab: string) => void;
  setActiveMiniGame?: (miniGame: string | null) => void;
}

export type TabValue = 'all' | 'favorites';

export type ShopTabValue = 'free-games' | 'cash-bonus' | 'free-bet';

export interface ShopItem {
  _id: string;
  name: string;
  desc: string;
  banner_path: string;
  type_pay: 'fiat' | 'points';
  cost: number;
  payout: number;
  type_gift: 'free_spins' | 'cash_bonus' | 'free_bet';
  vendors: string[];
  games: string[];
  status: boolean;
  currencySymbol?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MissionItem {
  id: number;
  title: string;
  description: string;
  date: string;
  icon?: string;
  isFavorite: boolean;
  category: 'free_games' | 'kelly_bonuses' | 'free_bets';
  tokens: number;
}