import React, { Component } from 'react';

class LoginSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: '',
      login: '',
      password: '',
      type: '',
    }
  }

  render() {
    return (
      <div>
        Login Settings
      </div>
    )
  }
};

export default LoginSetting;
