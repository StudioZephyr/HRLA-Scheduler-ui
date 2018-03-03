import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import LandingPage from '../landing/landingPage.jsx';
import LoginPage from '../auth/login.jsx';
import AccountPage from '../account/accountView.jsx';

class Routes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/account" component={AccountPage} />
      </Switch>
    )
  }
};

export default Routes;
