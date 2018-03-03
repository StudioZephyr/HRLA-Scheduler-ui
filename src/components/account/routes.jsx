import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

class AccountRoutes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/account" component={} />
        <Route path="/account/contacts" component={} />
        <Route path="/account/manage" component={} />
      </Switch>
    )
  }
};

export default AccountRoutes;
