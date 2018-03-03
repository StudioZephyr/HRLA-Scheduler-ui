import React, { Component } from 'react';

import CalendarCollection from '../calendarCollection/calendarCollection.jsx'




class LandingPage extends Component {
  constructor() {
    super();
  }

  render() {

    return (
      <div>
        <CalendarCollection />
      </div>
    )
  }
};

export default LandingPage;
