import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { authLogout } from '../../actions/authActions';

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized, logoutAction, user } = this.props;

    return (
      <div>
        <Link to="/">Home</Link>
        { 
          !authorized && 
          <Link to="/login">LOGIN</Link> 
        }
        {
          authorized && 
          <Link to={{
            pathname: '/account',
            state: { user }
          }}>ACCOUNT</Link>
        }
        { 
          authorized &&
          <button onClick={(e) => {
            e.preventDefault();
            logoutAction();
          }} >
            LOGOUT
          </button>
        }
      </div>
    )
  }
};

const NavbarState = (state) => {
  return {
    authorized: state.auth.authorized,
    user: state.auth.user,
  }
};

const NavbarDispatch = (dispatch) => {
  return {
    logoutAction: bindActionCreators(authLogout, dispatch),
  }
};

export default connect(NavbarState, NavbarDispatch)(Navbar);
