import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LandingNav extends Component {
  constructor() {
    super();
  }

  smoothScrollTo(key) {
    document.querySelector(`#${key}`).scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg bg-primary navbar-text-color">
        <span className="navbar-brand">
          <Link to="/">HRLA Scheduler</Link>
        </span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarAuthContent" aria-controls="navbarAuthContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse d-flex flex-row-reverse" id="navbarAuthContent">
          <div className="navbar-nav">
            <span className="nav-item nav-link" onClick={(e) => {
              e.preventDefault();
              this.smoothScrollTo('appInfo');
            }} >
              <a href="">THE APP</a>
            </span>
            <span className="nav-item nav-link" onClick={(e) => {
              e.preventDefault();
              this.smoothScrollTo('aboutTeam');
            }} >
              <a href="">CONTRIBUTORS</a>
            </span>
            <span className="nav-item nav-link">
              <Link to="/login">LOGIN</Link>
            </span>
          </div>
        </div>
      </nav>
    )
  }
}

export default LandingNav;
