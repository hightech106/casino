export interface BonusLang {
    lang: string;
    title: string;
    description: string;
    rules: string;
  }
  
  export interface BonusEvent {
    type: string;
  }
  
  export interface BonusProps {
    _id: string;
    bonusId: {
      _id: string;
      lang: BonusLang[];
      amount: number;
      wager: number;
      spend_amount: number;
      up_to_amount: number;
      free_spin?: number;
      games?: string[];
      event: BonusEvent;
      status: boolean;
      pre_image?: string;
    };
    userId: string;
    paymentsId?: string;
    amount: number;
    wager_amount: number;
    isSpend: number;
    isDeposit: number;
    added_bonus: number;
    status: 'active' | 'processing' | 'finished' | 'expired' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
  }