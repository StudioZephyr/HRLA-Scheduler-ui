import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './app.css';

import Routes from './routes.jsx';
import Navbar from '../navbar/navbarView.jsx';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="container">
        <Navbar />
        <div id="app-main-view">
          <Routes />
        </div>
      </div>
    )
  }
};

export default withRouter(App);
