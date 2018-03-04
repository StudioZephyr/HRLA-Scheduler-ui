import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import { authReducer as auth } from './authReducers';
import { contactsReducer as contact } from './contactReducer';

const Reducer = combineReducers({
  auth,
  contact,
  router,
});

export { Reducer };
