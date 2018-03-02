import React, { Component } from 'react';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


class LandingPage extends Component {
  constructor() {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      eventsList: [],
    }
  }

  componentDidMount() {
    this.setState({     
        id: 0,
        title: 'All Day Event very long title',
        allDay: true,
        start: new Date(2018, 2, 2),
        end: new Date(2018, 2, 3),
      })
  }


  render() {
    
    return (
      <div>
        <BigCalendar
          events={this.state.eventsList}
          defaultView={'day'}
          step={15}
          views={['week', 'day']}
          startAccessor='startDate'
          endAccessor='endDate'
          min={new Date('2018-03-02T16:00:00.113Z')}
          max={new Date('2018-03-02T04:00:00.113Z')}
          showMultiDayTimes
          defaultDate={new Date(2018, 2, 2)}
        />
      </div>
    )
  }
};

export default LandingPage;
