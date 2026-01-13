/**
 * TypeScript type definitions for casino games, providers, bonuses, and game history.
 * Defines interfaces for casino navigation, game data, tiers, bonus events, and table filters.
 * Note: Bonus type includes complex currency-specific rules and wagering requirements.
 */
export interface ProviderLogo {
    name: string;
    image: string;
  }


export interface ICasinoNav {
    _id: string;
    name: string;
    code: string;
    type: string;
    count: number;
    order: number;
    games: ICasinoGame[];
}


export interface ICasinoData {
    label: string;
    items: ICasinoNav[]
    icon?: string;
}

export interface ICasinoProvider {
    label: string;
    value: string;
}

export interface ICasinoGame {
    _id: string;
    game_code: string;
    game_name: string;
    banner: string;
    provider_code: string;
    order: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    provider?: string;
    type?: string;
    details: any;
}

export type ICasinoHistory = {
    _id: string;
    user_balance: number;
    game_type: string;
    provider_code: string;
    bet_money: number;
    win_money: number;
    refund_money: number;
    txn_id: string;
    txn_type: string;
    provider: {
        name: string;
    },
    game: {
        icon: string;
        name: string;
    },
    currency: string;
    createdAt: string;
};

export type ITier = {
    title: string;
    amount_played: number;
    cashback: number;
    currency_played: string;
    currencies: any[];
    amount_prize: number;
    currency_prize: string;
    freespin: number;
    wager: number;
    order: number;
    status: boolean;
}

export type IBonusEvent = {
    _id: string;
    title: string;
    value: string;
    status: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export type IBonus = {
    _id: string;
    lang: {
        lang: string;
        title: string;
        description: string;
        rules: string;
        pre_image: string;
        desc_image: string;
    }[];
    event: IBonusEvent;
    from_date: string;
  to_date: string;
  day: string[];
  activate_day: number;
  wager_day: number;
  currencies: {
    currency: string;
    amount: number;
    amount_type: string;
    deposit_amount_from: number;
    deposit_amount_to: number;
    spend_amount: number;
    up_to_amount: number;
    games: string[];
    free_games: string[];
    wager: number;
    max_bet_free_spin: number;
    max_bet_bonus_amount: number;
    free_spin: number;
    free_spin_up_to_amt: number;
    free_spin_type: string;
    player_type: string;
    players: string[];
    segmentation: string;
  }[];
  min_odds: number;
  max_odds: number;
  reward: string;
  sports_bet_type: string;
  sports_event_type: string;
  sports_type: string[];
  sports_leagues: string[];
  sports_matchs: string[];
  netlose_from: number;
  netlose_to: number;
  calculation_period: number;
  cashback_date: string;
  button_link: string;
  order: number;
  display: boolean;
  status: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  id?: string;
  daily: string;
}

export type ICasinoTableFilters = {
    name: string;
    category: string[];
    status: string;
};

export type ICasinoTableFilterValue = string | string[];
