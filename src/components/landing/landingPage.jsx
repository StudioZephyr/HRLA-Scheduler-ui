import React, { Component } from 'react';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';


class LandingPage extends Component {
  constructor() {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      eventsList: []
    }
  }

  componentDidMount() {
    this.setState({
      eventsList: [{
        id: 0,
        title: 'All Day Event very long title',
        allDay: true,
        start: new Date(2018, 3, 2),
        end: new Date(2018, 3, 3),
      }]
    })
  }


  render() {
    return (
      <div>
        {console.log(this)}
        <BigCalendar
          events={this.state.eventsList}
          startAccessor='startDate'
          endAccessor='endDate'
        />
      </div>
    )
  }
};

export default LandingPage;
