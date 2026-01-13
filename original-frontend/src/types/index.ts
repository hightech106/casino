
export type TabPanelProps = 'manual' | 'auto';

export type PlayerProps = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  currency: string;
  currencyIcon: string;
  autoCashOut: number;
  stoppedAt: number;
  betAmount: number;
};

export interface HistoryProps {
  _id: string;
  user: PlayerProps;
  gameid: string;
  type: string;
  bet: number;
  target: number;
  payout: number;
  createdAt: string;
}
