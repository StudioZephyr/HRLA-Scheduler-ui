import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CalendarCollection from '../calendarCollection/calendarCollection.jsx'
import img from '../../assets/HRLAcreate.png';
import img2 from '../../assets/HRLAedit.png';



class LandingPage extends Component {
  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <div className="welcome">
          <h1>Hack Reactor Los Angeles Room Scheduler</h1>
        </div>
        <img src={img} />
        <img src={img2} />
        <Link
          to={{
            pathname: "/calendar"
          }}>
          Proceed to calendar
          </Link>
      </div>
    )
  }
};

export default LandingPage;
