import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'localforage';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { Reducer } from '../reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(
  thunk,
  router,
  createLogger()
);

const persistConfig = {
  key: 'hrla-scheduler',
  storage,
  blacklist: ['calendar']
};

const persistedReducer = persistReducer(persistConfig, Reducer);

function configureStore() {
  let store = createStore(persistedReducer, enhancer);
  let persistor = persistStore(store);
  return { store, persistor };
};

export { configureStore, history };
