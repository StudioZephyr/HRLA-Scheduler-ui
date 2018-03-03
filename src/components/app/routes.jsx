import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import LandingPage from '../landing/landingPage.jsx';
import LoginPage from '../auth/login.jsx';

class Routes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={LandingPage} />
      </Switch>
    )
  }
};

export default Routes;
