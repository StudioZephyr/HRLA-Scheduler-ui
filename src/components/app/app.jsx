import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './app.css';

import Routes from './routes.jsx';
import Navbar from '../navbar/navbarView.jsx';
import LandingNav from '../landing/landingNav.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        {
          this.props.location.pathname === '/' ? <LandingNav /> : <Navbar />
        }
        <div id="app-main-view">
          <Routes />
        </div>
      </div>
    )
  }
};

export default withRouter(App);
