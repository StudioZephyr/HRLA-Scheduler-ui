import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class AccountView extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        Account Settings View
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
