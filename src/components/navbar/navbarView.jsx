import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { authLogout } from '../../actions/authActions';

import './navbarView.css';

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized, logoutAction, type, userName } = this.props;

    return (
      <nav className="navbar fixed-top navbar-expand-lg bg-primary navbar-text-color">
        <span className="navbar-brand">
          <Link to="/">HRLA Scheduler</Link>
        </span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarAuthContent" aria-controls="navbarAuthContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
          <span className="nav-item nav-link nav-name">{userName}</span>
        <div className="collapse navbar-collapse d-flex flex-row-reverse" id="navbarAuthContent">
          <div className="navbar-nav">
            { 
              // !authorized &&
              // <span className="nav-item nav-link">
              //   <Link to="/login">LOGIN</Link> 
              // </span> 
            }
            {
              authorized && 
              <span className="nav-item nav-link">
                <Link to={{
                  pathname: "/account",
                  state: { authorized, type }
                }}>ACCOUNT</Link>
              </span>
            }
            { 
              authorized &&
              <button className="btn btn-outline-light" onClick={(e) => {
                e.preventDefault();
                logoutAction();
              }} >
                LOGOUT
              </button>
            }
          </div>
        </div>
      </nav>
    )
  }
};

const NavbarState = (state) => {
  return {
    authorized: state.auth.authorized,
    type: state.auth.user.type,
    userName: state.auth.user.groupName
  }
};

const NavbarDispatch = (dispatch) => {
  return {
    logoutAction: bindActionCreators(authLogout, dispatch),
  }
};

export default connect(NavbarState, NavbarDispatch)(Navbar);
