import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import './accountView.css';

import AccountRoutes from './routes.jsx';
import TabBar from '../tab-bar/tabBarView.jsx';

class AccountView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized, type } = this.props.location.state;

    if (!authorized) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div className="row">
        <div id="tab-nav">
          <TabBar authorized={authorized} type={type} />
        </div>
        <div className="col col-lg-12" id="settings-view">
          <AccountRoutes />
        </div>
      </div>
    )
  }
};

export default withRouter(AccountView);
