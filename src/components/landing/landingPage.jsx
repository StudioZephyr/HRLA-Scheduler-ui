import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CalendarCollection from '../calendarCollection/calendarCollection.jsx'
import img from '../../assets/HRLAcreate.png';
import img2 from '../../assets/HRLAedit.png';

import './landingPage.css';

class LandingPage extends Component {
  constructor() {
    super();
  }

  render() {

    if (this.props.authorized) {
      return (
        <Redirect
          to={{
            pathname: "/calendar"
          }}
        />
      )
    } else {
      return (
        <div>
          <div className="welcome">
            <h1>Hack Reactor Los Angeles Room Scheduler</h1>
          </div>
          <h4>Login to get started</h4>
          <div className="carouselContainer"style={{ width: '60%', height: '33.75%' }}>
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              </ol>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img className="d-block w-100" src={img} alt="First slide" />
                  <div className="carousel-caption d-none d-md-block">
                    <p>Click and drag to create an event</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img className="d-block w-100" src={img2} alt="Second slide" />
                  <div className="carousel-caption d-none d-md-block">
                    <p className>Select your event to edit it</p>
                  </div>
                </div>
              </div>
              <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      )
    }
  }
};

const LandingPageState = (state) => {
  return {
    authorized: state.auth.authorized,
  }
}

const LandingPageDispatch = (dispatch) => {

}

export default connect(LandingPageState, LandingPageDispatch)(LandingPage);
