import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginSetting from '../loginSettings/loginSettings.jsx';

class AccountRoutes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/account" component={LoginSetting} />
        {/* <Route path="/account/contacts" component={} /> */}
        {/* <Route path="/account/manage" component={} /> */}
      </Switch>
    )
  }
};

export default AccountRoutes;
