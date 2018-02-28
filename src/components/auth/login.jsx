import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import { authLogin } from '../../actions/authActions';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
    };
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

  render() {
    const { login, password } = this.state;
    const { authorized, loginAction } = this.props;

    if (authorized) {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div>
        <form>
          <input type="text" placeholder="Login" onChange={(e) => {this.setLogin(e.target.value)}} />
          <input type="password" placeholder="Password" onChange={(e) => {this.setPassword(e.target.value)}} />
          <button type="submit" onClick={(e) => {
            e.preventDefault();
            const userObj = {
              login,
              password,
            };
            loginAction(userObj);
          }} >
            Login
          </button>
        </form>
      </div>
    )
  }
};

const LoginState = (state) => {
  return {
    user: state.auth.user,
    authorized: state.auth.authorized,
  }
};

const LoginDispatch = (dispatch) => {
  return {
    loginAction: bindActionCreators(authLogin, dispatch),
  }
};

export default connect(LoginState, LoginDispatch)(LoginPage);
