import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import { authLogin } from '../../actions/authActions';
import { getContacts } from '../../actions/contactActions';

import './login.css';

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
    const { authorized, getContacts, loginAction, user } = this.props;

    if (authorized) {
      getContacts(user.id);
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div id="Login-auth" className="d-flex justify-content-center">
        <form>
          <div className="form-group md-5">
            <label htmlFor="inputLogin-auth">Login</label>
            <input type="text" id="inputLogin-auth" className="form-control" 
              onChange={(e) => {this.setLogin(e.target.value)}} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputPW-auth">Password</label>
            <input type="password" id="inputPW-auth" className="form-control" aria-describedby="authHelpBlock"
              onChange={(e) => {this.setPassword(e.target.value)}} 
            />
            <small id="authHelpBlock" className="form-text text-muted">
              Contact your Project Check-in HiR if you have forgotten your Login/PW
            </small>
          </div>
          <div className="form-row justify-content-end">
            <button type="submit" className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                const userObj = {
                  login,
                  password,
                };
                loginAction(userObj);
              }}
            >
              Login
            </button>
          </div>
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
    getContacts: bindActionCreators(getContacts, dispatch)
  }
};

export default connect(LoginState, LoginDispatch)(LoginPage);
