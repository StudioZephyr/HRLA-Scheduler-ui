import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'react-router-redux';

import { configureStore, history } from './store/configureStore';

import './global.css';

import App from './components/app/app.jsx';
import LoadingView from './components/loading/loadingView.jsx'

const { store, persistor } = configureStore();

render(
  <Provider store={store}>
    <PersistGate loading={<LoadingView />} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
