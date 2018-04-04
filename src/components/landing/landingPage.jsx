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
        <div id="landingPage">
          <div id="intro" className="component">
            <div className="row justify-content-center">
              <div className="col-lg-12 align-self-center">
                <h4>Hack Reactor Los Angeles</h4>
                <h1>Room Scheduler</h1>
              </div>
            </div>
          </div>
          <div id="appInfo" className="component">
            <div className="component-header">
              <p className="header-title">{'Schedule Rooms for your appointments, 1 <> 1, or group projects.'}</p>
              <p className="header-detail">
                The HRLA Scheduler makes it easy to keep track of ALL rooms and timeslots.
                Schedule rooms to make sure your group stays on top of the timeline, to go over sprints, SCRUM, or
                just to have some quality group time! The scheduler updates in real-time to reflect any changes made
                to the calendar and/or timeslot!
              </p>
            </div>
          </div>
          <div id="appInfo-detail">
            <div className="row appInfo-container">
              <div className="col-lg-7 align-self-center">
                <img className="appImage" src={img} />
              </div>
              <div className="col-lg-5 align-self-end">
                <h4 className="appInfo-title">Schedule a Room</h4>
                <p className="appInfo-detail">
                  It's as easy as clicking and dragging. Make sure you don't overlap any existing timeslots, otherwise your timeslot
                  will not be scheduled! Be aware that your timeslot is not 100% guaranteed in case of a HiR or Staff scheduling.
                  Your timeslot will be scheuled in real-time and be reflected in the calendar.
                </p>
              </div>
            </div>
            <div className="row appInfo-container">
              <div className="col-lg-5 align-self-end left-col">
                <h4 className="appInfo-title">Edit Timeslots</h4>
                <p className="appInfo-detail">
                  You can edit your timeslots up until its scheduled time. A simple click will bring
                  up a menu where you can edit the description, start and end time. Remember, make sure it does
                  not overlap with any exisiting timeslot! Your changes will be reflected immediately as long
                  as the edit is successful.
                </p>
              </div>
              <div className="col-lg-7 align-self-center">
                <img className="appImage" src={img2} />
              </div>
            </div>
          </div>
          <div id="aboutTeam" className="component">
            <div className="component-header">
              <p className="header-title">Contributors</p>
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

export default connect(LandingPageState)(LandingPage);
