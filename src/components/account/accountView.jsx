import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import AdminAccount from './adminAccount.jsx';
import GroupAccount from './groupAccount.jsx';

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
        {
          user.type === 'admin' ?
          <AdminAccount user={user} /> :
          <GroupAccount user={user} updateLogin={updateLogin} />
        }
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

export default connect(AccountState, AccountDispatch)(AccountView);
