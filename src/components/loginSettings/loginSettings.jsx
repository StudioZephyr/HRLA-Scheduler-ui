import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateLogin } from '../../actions/authActions';

import GroupLogin from './groupLogin.jsx';
import AdminLogin from './adminLogin.jsx';

class LoginSetting extends Component {
  constructor(props) {
    super(props);

    const { groupName, login, password } = this.props.user;

    this.state = {
      groupName,
      login,
      password,
      editDisabled: true,
    }

    this.setGroupName = this.setGroupName.bind(this);
    this.setLogin = this.setLogin.bind(this);
  }

  setGroupName(text) {
    this.setState({
      groupName: text,
    });
  }

  setLogin(text) {
    this.setState({
      login: text,
    });
  }

  toggleEdit() {
    this.setState({
      editDisabled: !this.state.editDisabled,
    });
  }

  render() {
    const { updateLogin, user } = this.props;
    const { editDisabled, groupName, login, password } = this.state;

    return (
      <div>
        {
          user.type === 'group' &&
          <GroupLogin groupName={groupName} setGroupName={this.setGroupName} editDisabled={editDisabled} />
        }
        {
          user.type === 'admin' &&
          <AdminLogin groupName={groupName} login={login} password={password}
            setGroupName={this.setGroupName} 
            setLogin={this.setLogin}
            editDisabled={editDisabled} 
          />
        }
        {
          !editDisabled &&
          <button onClick={(e) => {
            e.preventDefault();
            updateLogin({ groupName, login, password }, user.id);
            this.toggleEdit();
          }}>
            SUBMIT
          </button>
        }
        <button onClick={(e) => {
          e.preventDefault();
          this.toggleEdit();
        }}>
          { editDisabled ? 'EDIT' : 'CANCEL' }
        </button>
      </div>
    )
  }
};

const LoginState = (state) => {
  return {
    user: state.auth.user,
  }
};

const LoginDispatch = (dispatch) => {
  return {
    updateLogin: bindActionCreators(updateLogin, dispatch),
  }
};

export default connect(LoginState, LoginDispatch)(LoginSetting);
