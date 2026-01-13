// ----------------------------------------------------------------------

const ROOTS = {
  home: "/",
  auth: '/auth',
  crash: '/crash',
  coinflip: '/coinflip',
  plinko: '/plinko',
  flowerpoker: '/flowerpoker',
  mine: '/mine',
  blackjack: '/blackjack',
  wheel: '/wheel',
  dice: '/dice',
  diamonds: '/diamonds',
  limbo: '/limbo',
  keno: '/keno',
  hilo: '/hilo',
  videopoker: '/videopoker',
  slide: '/slide',
  baccarat_s: '/baccarat_single',
  baccarat_m: '/baccarat_multi',
  goal: '/goal',
  roulette: '/roulette',
  hilo_m: '/hilo_multi',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-MAIN/',
  // AUTH
  auth: {
    login: `${ROOTS.auth}/login`,
    register: `${ROOTS.auth}/register`,
  },
  home: {
    root: ROOTS.home,
  },
  crash: {
    root: ROOTS.crash,
  },
  coinflip: {
    root: ROOTS.coinflip,
  },
  plinko: {
    root: ROOTS.plinko,
  },
  flowerpoker: {
    root: ROOTS.flowerpoker,
  },
  mine: {
    root: ROOTS.mine,
  },
  blackjack: {
    root: ROOTS.blackjack,
  },
  wheel: {
    root: ROOTS.wheel,
  },
  dice: {
    root: ROOTS.dice,
  },
  diamonds: {
    root: ROOTS.diamonds,
  },
  limbo: {
    root: ROOTS.limbo,
  },
  keno: {
    root: ROOTS.keno,
  },
  hilo: {
    root: ROOTS.hilo,
  },
  videopoker: {
    root: ROOTS.videopoker,
  },
  slide: {
    root: ROOTS.slide,
  },
  baccarat_s: {
    root: ROOTS.baccarat_s,
  },
  baccarat_m: {
    root: ROOTS.baccarat_m,
  },
  goal: {
    root: ROOTS.goal,
  },
  roulette: {
    root: ROOTS.roulette,
  },
  hilo_m: {
    root: ROOTS.hilo_m,
  },
  user: {
    history: `${ROOTS.home}history`,
  },
};
