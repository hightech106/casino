/**
 * Central route path definitions for the entire application.
 * Organizes routes into home, user, sports, and casino sections with nested paths.
 * Note: Casino routes include many game category paths that are dynamically generated.
 */
// ----------------------------------------------------------------------

const ROOTS = {
  HOME: '',
  USER: '/user',
  SPORTS: '/sports',
  CASINO: '/casino',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',

  home: {
    root: ROOTS.HOME,
    faq: `${ROOTS.HOME}/faq`,
    blog: `${ROOTS.HOME}/blog`,
    terms: `${ROOTS.HOME}/terms`,
  },

  user: {
    root: ROOTS.USER,
    wallet: `${ROOTS.USER}/wallet`,
    myshares: `${ROOTS.USER}/my-shares`,
    mypurchases: `${ROOTS.USER}/my-purchases`,
    missions: `${ROOTS.USER}/missions`,
    account: `${ROOTS.USER}/account`,
    notification: `${ROOTS.USER}/notification`,
    referral: `${ROOTS.USER}/referral`,
    password: `${ROOTS.USER}/password`,
    support: `${ROOTS.USER}/support`,
    ticket: `${ROOTS.USER}/ticket`,
    mybets: `${ROOTS.USER}/my-bets`,
    mybets_sports: `${ROOTS.USER}/my-bets/sports`,
    mybets_casino: `${ROOTS.USER}/my-bets/casino`,
  },

  sports: {
    root: ROOTS.SPORTS,
    live: `${ROOTS.SPORTS}/live`,
    match: {
      detail: (matchId: string) => `${ROOTS.SPORTS}/match/${matchId}`,
    },
    detail: {
      url: `${ROOTS.SPORTS}/detail`,
      details: (sportsId: string | number, eventId: string | number) =>
        `${ROOTS.SPORTS}/${sportsId}/detail/${eventId}`,
    },
    favorite: `${ROOTS.SPORTS}/favorite`,
  },

  casino: {
    root: ROOTS.CASINO,
    signin: `${ROOTS.CASINO}/signin`,
    signup: `${ROOTS.CASINO}/signup`,
    journey: `${ROOTS.CASINO}/journey`,
    jackPot: `${ROOTS.CASINO}/jackpot`,
    megaways: `${ROOTS.CASINO}/megaways`,
    spin: `${ROOTS.CASINO}/spin`,
    promotion: `${ROOTS.CASINO}/promotion`,
    original: `${ROOTS.CASINO}/original`,
    top_games: `${ROOTS.CASINO}/top_games`,
    fast_games: `${ROOTS.CASINO}/fast_games`,
    vendor: `${ROOTS.CASINO}/vendor`,
    tournament: `${ROOTS.CASINO}/tournament`,
    leaderboard: `${ROOTS.CASINO}/leaderboard`,
    live: `${ROOTS.CASINO}/live-casino`,
    detail: `${ROOTS.CASINO}/detail`,
    slot: `${ROOTS.CASINO}/casino`,
    baccarat: `${ROOTS.CASINO}/baccarat`,
    video_poker: `${ROOTS.CASINO}/video_poker`,
    poker: `${ROOTS.CASINO}/poker`,
    lottery: `${ROOTS.CASINO}/lottery`,
    roulette: `${ROOTS.CASINO}/roulette`,
    card: `${ROOTS.CASINO}/card`,
    andarbahar: `${ROOTS.CASINO}/andarbahar`,
    crashgame: `${ROOTS.CASINO}/crashgame`,
    gameshow: `${ROOTS.CASINO}/gameshow`,
    tablegames: `${ROOTS.CASINO}/tablegames`,
    virtual: `${ROOTS.CASINO}/virtual-games`,
    blackjack: `${ROOTS.CASINO}/blackjack`,
    lobby: `${ROOTS.CASINO}/lobby`,
    dice: `${ROOTS.CASINO}/dice`,
    sports: `${ROOTS.CASINO}/sports`,
    other: `${ROOTS.CASINO}/other`,
    dragontiger: `${ROOTS.CASINO}/dragontiger`,
    blog: `${ROOTS.CASINO}/blog`,
    terms: `${ROOTS.CASINO}/terms`,
    support: `${ROOTS.CASINO}/support`,
  },
};
