/* eslint-disable-next-line padded-blocks */
import { combineReducers } from 'redux';

import auth from './auth';
import menu from './menu';
import sports from './sports';
import casino from './casino';
import config from './config';

const reducer = combineReducers({
  auth,
  menu,
  sports,
  casino,
  config,
});

export default reducer;
