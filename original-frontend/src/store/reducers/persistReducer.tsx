import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'luckverse777',
  storage,
  whitelist: ['setting']
};

const persist = (reducers: any) => persistReducer(persistConfig, reducers);

export default persist;
