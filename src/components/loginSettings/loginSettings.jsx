import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateLogin } from '../../actions/authActions';

import './loginSettings.css';

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
    this.setPassword = this.setPassword.bind(this);
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

  setPassword(text) {
    this.setState({
      password: text,
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
      <div id="login-settings" className="row justify-content-center settings-row" >
        <div className="col col-lg-auto">
          {
            user.type === 'group' &&
            <GroupLogin groupName={groupName} setGroupName={this.setGroupName} editDisabled={editDisabled} />
          }
          {
            user.type === 'admin' &&
            <AdminLogin groupName={groupName} login={login} password={password}
              setGroupName={this.setGroupName} 
              setLogin={this.setLogin}
              setPassword={this.setPassword}
              editDisabled={editDisabled} 
            />
          }
        </div>
        <div className="col col-lg-4 align-self-end">
          {
            !editDisabled &&
            <button className="btn btn-primary" onClick={(e) => {
              e.preventDefault();
              updateLogin({ groupName, login, password }, user.id);
              this.toggleEdit();
            }}>
              SUBMIT
            </button>
          }
          <button className="btn btn-primary" onClick={(e) => {
            e.preventDefault();
            this.toggleEdit();
          }}>
            { editDisabled ? 'EDIT' : 'CANCEL' }
          </button>
        </div>
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
