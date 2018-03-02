import React, { Component } from 'react';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


class Calendar extends Component {
  constructor() {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      eventsList: [{
        title: 'All Day Event very long initial event',
        // allDay: true,
        start: new Date(2018, 2, 2, 15, 0, 0),
        end: new Date(2018, 2, 2, 17, 0, 0),
      }],
    }
  }

  componentDidMount() {
    this.setState({
      eventsList: [{
        title: 'Test event',
        start: new Date(2018, 2, 2, 13, 0, 0),
        end: new Date(2018, 2, 2, 15, 0, 0),
      }]
    })
  }


  render() {

    return (
      <div>
        test
        <BigCalendar
          events={this.state.eventsList}
          defaultView={'day'}
          step={15}
          views={['week', 'day']}
          min={new Date('2018-03-02T16:00:00.113Z')}
          max={new Date('2018-03-02T04:00:00.113Z')}
          defaultDate={new Date(2018, 2, 2)}
        />
      </div>
    )
  }
};

export default Calendar;
