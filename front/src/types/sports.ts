/**
 * TypeScript type definitions for sports betting functionality.
 * Defines types for sports events, matches, odds, bets, betslips, and sports history.
 * Note: Includes complex nested types for event details, scores, and market data structures.
 */
import type { ReactElement, ReactNode } from 'react';
import type { CurrencyProps } from './payment';

export type GuardProps = {
  children: ReactElement | null;
};

export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export type IBetType = 'single' | 'multi';
export type ISportsHisotry = 'Active' | 'Settled';
export type IEventStatus = 'ALL' | 'LIVE' | 'HOUR' | 'TODAY' | 'PRE';

export interface StringColorProps {
  id?: string;
  label?: string;
  color?: string;
  primary?: string;
  secondary?: string;
}

export type StringBoolFunc = (s: string) => boolean;
export type StringNumFunc = (s: string) => number;
export type NumbColorFunc = (n: number) => StringColorProps | undefined;

export type INavData = {
  title: string;
  path: string;
  icon?: any;
  info?: any;
  type?: any;
  children?: INavData[];
};

export type ISportsList = {
  _id: string;
  icon: string;
  color: string;
  SportId: number;
  SportName: string;
  live: boolean;
  upcoming: boolean;
  img: string;
  count: number;
};

export type ISportsMarketItem = {
  _id: string;
  sportId: any;
  order: number;
  groupId: string;
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ISportsMarket = {
  _id: string;
  order: number;
  groupId: string;
  id: string;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  items: ISportsMarketItem[];
};

export type ISportsMatch = {
  LeagueId: number;
  LeagueName: string;
  LeagueLogo?: string;
  events: ISportsEvent[];
};

export type IEventDetail = {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: any;
    name: string;
  };
  assist: {
    id: any;
    name: any;
  };
  type: 'Card' | 'Goal';
  detail: 'Yellow Card' | 'Red Card';
  comments: any;
};

export type ISportsEvent = {
  _id: string;
  id: number;
  sport_id: number;
  league: ILeague;
  events: IEventDetail[];
  home: {
    id: number;
    name: string;
    image_id: number;
    logo?: string;
    cc: string;
  };
  away: {
    id: number;
    name: string;
    image_id: number;
    logo?: string;
    cc: string;
  };
  odds?: any;
  bet365_id?: number;
  bet365_odds?: any;
  extra?: any;
  stats?: {
    statistics?: any[];
    lineups?: any;
    players?: any;
  };
  f_score?: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
  f_status?: {
    long: string;
    short: string;
    elapsed: number;
    extra: number;
  };
  ss: any;
  time: number;
  time_status: number;
  timer: any;
  scores?: any;
  markets: number;
};

export type ILeague = {
  id: number;
  name: string;
  cc: any;
  logo?: string;
};

export type IOdds = {
  id: string;
  home_od?: string;
  draw_od?: string;
  away_od?: string;
  over_od?: string;
  under_od?: string;
  od?: string;
  handicap: string;
  ss: any;
  time_str: any;
  add_time: string;
};

export type ISportsBet = {
  type: IBetType;
  stake: number;
  selectedFreeBet?: string;
  isFreeBet?: boolean;
  data: any;
};

export interface IFreeBet {
  _id: string;
  shopId: string;
  shopName: string;
  shopDescription: string;
  type_gift: string;
  type_pay: string;
  cost: number;
  payout: number;
  maxodds: number;
  leagueId: number;
  matchId: number;
  status: string;
  activate: boolean;
  createdAt: string;
}

export type IMenu = {
  selectedItem: string[];
  drawerOpen: boolean;
  headerHide: boolean;
  footerHide: boolean;
  page: string;
};

export const inintSportsData = {
  _id: '',
  SportId: 0,
  SportName: '',
  color: '',
  count: 0,
  icon: '',
  img: '',
  live: true,
  upcoming: true,
};

export const initEvents = {
  _id: '',
  id: 0,
  home: {
    id: 0,
    image_id: 0,
    cc: '',
    name: '',
  },
  away: {
    id: 0,
    image_id: 0,
    cc: '',
    name: '',
  },
  league: {
    id: 0,
    image_id: 0,
    cc: '',
    name: '',
  },
  sport_id: 0,
  ss: '',
  time: Date.now() / 1000,
  timer: {},
  odds: {},
  scores: {},
  time_status: 1,
};

export enum IOddTypes {
  Home = 'home',
  Away = 'away',
  Draw = 'draw',
  Over = 'over',
  Under = 'under',
}

export interface SportsParamsProps {
  sportsId?: number;
  tabId?: number;
}

export interface SportsListProps {
  _id: string;
  SportId: number;
  SportName: string;
  color: string;
  count: number;
  icon: string;
  img: string;
  live: boolean;
  upcoming: boolean;
}

export interface SportsTeamProps {
  id: number;
  image_id: number;
  cc: string;
  name: string;
}

export interface SportsLeagueProps {
  id: number;
  cc: string;
  name: string;
}

export interface TabProps {
  index?: number;
  title?: string;
  status?: string;
  icon?: ReactNode;
}

export interface LockProps {
  item: any;
  sports: SportsListProps | undefined;
  isLive: boolean;
  event: ISportsEvent;
}

export interface EventProps {
  event: ISportsEvent;
  activeSports: SportsListProps | undefined;
  isLive: boolean;
}

export interface MarketDataProps {
  id: string;
  ss: string;
  notUpdate: number;
  add_time: string;
  time_str: string;
  home_od?: string | undefined;
  away_od?: string | undefined;
  draw_od?: string | undefined;
  over_od?: string | undefined;
  under_od?: string | undefined;
  handicap?: string | undefined;
}

export interface MarketProps {
  id: string;
  name: string;
  home: string;
  away: string;
  league: string;
  marketId: string;
  data: MarketDataProps;
}

export interface BetslipProps {
  AwayTeam: string;
  HomeTeam: string;
  LeagueId: number;
  LeagueName: string;
  SportId: number;
  SportName: string;
  Time: number;
  TimeStatus: number;
  eventId: number;
  bet365Id?: number;
  marketId: string;
  marketName: string;
  oddData: oddProps | any;
  oddId: string;
  oddName: string;
  odds: number;
  sports: SportsListProps;
  stake: number;
  oddType: IOddTypes | string;
  handicap?: number;
  isBet365?: boolean;
}

export interface SportsProps {
  betslipData: BetslipProps[];
  betAmount: number;
  betslipOpen: boolean;
  search: string;
}

export interface oddProps {
  id: string;
  marketId: string;
  marketName: string;
  add_time: string;
  ss: string | null;
  time_str: string | null;
  home_od?: string | undefined;
  away_od?: string | undefined;
  draw_od?: string | undefined;
  over_od?: string | undefined;
  under_od?: string | undefined;
  handicap?: string | undefined;
}

export interface SelectOddProps {
  event: ISportsEvent;
  odd: oddProps | any;
  sports: SportsListProps;
  oddType: IOddTypes | string;
  isBet365?: boolean;
}

export interface SportsHistoryProps {
  _id: string;
  betsId: string;
  userId: string;
  currency: CurrencyProps;
  odds: number;
  stake: number;
  profit: number;
  potential: number;
  type: IBetType;
  betType: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  sport: ISportsList[];
  bettings: BetslipProps[];
}
