import React, { Component } from 'react';

import GroupLogin from './groupLogin.jsx';
import AdminLogin from './adminLogin.jsx';

class LoginSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: '',
      login: '',
      password: '',
      type: '',
      editDisabled: true,
    }

    this.setGroupName = this.setGroupName.bind(this);
  }

  setGroupName(text) {
    this.setState({
      groupName: text,
    });
  }

  render() {
    const { user } = this.props.location.state;
    const { editDisabled } = this.state;

    return (
      <div>
        {
          user.type === 'group' &&
          <GroupLogin groupName={user.groupName} setGroupName={this.setGroupName} editDisabled={editDisabled} />
        }
        {
          user.type === 'admin' &&
          <AdminLogin groupName={user.groupName} setGroupName={this.setGroupName} editDisabled={editDisabled} />
        }
      </div>
    )
  }
};

export default LoginSetting;
