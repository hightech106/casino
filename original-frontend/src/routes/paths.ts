// ----------------------------------------------------------------------

const ROOTS = {
  home: "/",
  auth: '/auth',
  keno: '/keno',
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
  keno: {
    root: ROOTS.keno,
  },
  user: {
    history: `${ROOTS.home}history`,
  },
};
