import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import AccountRoutes from './routes.jsx';
import TabBar from '../tab-bar/tabBarView.jsx';

class AccountView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized } = this.props.location.state;

    if (!authorized) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div>
        <TabBar authorized={authorized} />
        <AccountRoutes />
      </div>
    )
  }
};

export default withRouter(AccountView);
