import React, { Component } from 'react';

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
          }} >
            Login
          </button>
        </form>
      </div>
    )
  }
};

export default LoginPage;
