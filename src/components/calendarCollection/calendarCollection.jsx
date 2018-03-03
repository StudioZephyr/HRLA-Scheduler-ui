import React, { Component } from 'react';

import Calendar from '../calendar/calendar.jsx'

import './calendarCollection.css';

class CalendarCollection extends Component {
  constructor() {
    super();
    this.state= {
      totalRooms: new Array(4).fill('filler') //make number refer to a dynamic property on props
    }
  }

  render() {
    return (
      <div id='calendars'>
        {
          this.state.totalRooms.map((x, i, arr) => {
            return <Calendar room={i} collectionSize={arr.length} />
          })
        }
      </div>
    )
  }
};

export default CalendarCollection;
