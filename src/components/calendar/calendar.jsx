import React, { Component } from 'react';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './calendar.css';

class Calendar extends Component {
  constructor() {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      eventRow: new Array(24).fill(0), //array length should be length of day in hours * 2
      eventsList: [{
        title: 'All Day Event very long initial event',
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

    this.fillTimeSlot(new Date(2018, 2, 2, 13, 0, 0), new Date(2018, 2, 2, 15, 0, 0))
    console.log(this.state.eventRow);
    document.getElementById(`room${this.props.room}`)
    .getElementsByClassName('rbc-header')[0]
    .textContent = this.props.room === 0 ? `Room` : `Room ${this.props.room}` //replace room number with room name
  }

  toIdx(time) {
    return (time.getHours() - 8) * 2 + (time.getMinutes() === 0 ? 0 : 1);
  }

  fillTimeSlot(startTime, endTime) {
    let startIdx = this.toIdx(startTime);
    let endIdx = this.toIdx(endTime);
    for (let i = startIdx; i < endIdx; i++){
      this.state.eventRow[i] = 1;
    }
  }

  render() {

    return (
      <div id={`room${this.props.room}`} className='calendar'>
      {this.props.currDate ? 
        <BigCalendar
          events={this.state.eventsList}
          view={this.props.calType}
          date={this.props.currDate}
          step={15}
          views={['week', 'day']}
          min={new Date('2018-03-02T16:00:00.113Z')}
          max={new Date('2018-03-02T04:00:00.113Z')}
          defaultDate={new Date(2018, 2, 2)}
        />
      : 
      <p>Loading</p>
      }
      </div>
    )
  }
};

export default Calendar;
