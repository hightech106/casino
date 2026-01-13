/* eslint-disable-next-line padded-blocks */
import { combineReducers } from 'redux';

import auth from './auth';
import setting from './setting';

const reducer = combineReducers({
  auth,
  setting,
});

export default reducer;
