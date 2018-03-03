import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, withRouter } from 'react-router-dom';

import AccountRoutes from './routes.jsx';
import TabBar from '../tab-bar/tabBarView.jsx';

import { updateLogin } from '../../actions/authActions';

class AccountView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized, updateLogin, user } = this.props;

    if (!authorized) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div>
        <TabBar user={user} />
        <AccountRoutes />
      </div>
    )
  }
};

const AccountState = (state) => {
  return {
    user: state.auth.user,
    authorized: state.auth.authorized,
  }
};

const AccountDispatch = (dispatch) => {
  return {
    updateLogin: bindActionCreators(updateLogin, dispatch),
  }
};

export default withRouter(connect(AccountState, AccountDispatch)(AccountView));
