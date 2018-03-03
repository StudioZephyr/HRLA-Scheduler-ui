import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import AdminAccount from './adminAccount.jsx';
import GroupAccount from './groupAccount.jsx';

class AccountView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user, authorized } = this.props;

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
          <GroupAccount user={user} />
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

export default connect(AccountState)(AccountView);
