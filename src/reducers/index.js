import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

const Reducer = combineReducers({
  router,
});

export { Reducer };
