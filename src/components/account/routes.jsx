import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginSetting from '../loginSettings/loginSettings.jsx';
import ContactSetting from '../contactSettings/contactSettings.jsx';
import ManageGroupSetting from '../manageGroup/manageGroupsSettings.jsx';

class AccountRoutes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/account" component={LoginSetting} />
        <Route path="/account/contacts" component={ContactSetting} />
        <Route path="/account/manage" component={ManageGroupSetting} />
      </Switch>
    )
  }
};

export default AccountRoutes;
