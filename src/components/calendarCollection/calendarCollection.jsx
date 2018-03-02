import React, { Component } from 'react';

import Calendar from '../calendar/calendar.jsx'


class CalendarCollection extends Component {
  constructor() {
    super();
    this.state= {
      totalRooms: new Array(4).fill('filler') //make number refer to a dynamic property on props
    }
  }

  render() {
    return (
      <div>
        {console.log(this.state.totalRooms)}
        {
          this.state.totalRooms.map((x, i) => {
            return <Calendar room={i} />

          })
        }
      </div>
    )
  }
};

export default CalendarCollection;
