import React, { Component } from 'react';

import Calendar from '../calendar/calendar.jsx'

import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendarCollection.css';

class CalendarCollection extends Component {
  constructor() {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      totalRooms: new Array(5).fill('filler'), //make number refer to a dynamic property on props
      currDay: moment()
    }
  }

  componentDidMount() {
    document.getElementsByClassName('rbc-btn-group')[0]
    .getElementsByTagName('button')[0]
    .onclick = ()=>{this.dayReset()}

    document.getElementsByClassName('rbc-btn-group')[0]
    .getElementsByTagName('button')[1]
    .onclick = ()=>{this.dayBack()}
    
    document.getElementsByClassName('rbc-btn-group')[0]
    .getElementsByTagName('button')[2]
    .onclick = ()=> {this.dayForward()}
    
  }

  dayReset() {
    this.setState({
      currDay: moment()
    })
  }

  dayBack() {
    this.setState({
      currDay: moment(this.state.currDay).subtract(1, 'days')
    })
  }

  dayForward() {
    this.setState({
      currDay: moment(this.state.currDay).add(1, 'days')
    })
  }

  render() {
    return (
      <div>
        <div id='calendarNav'>
          <div className='container'></div>
          <BigCalendar
            events={[]}
            date={this.state.currDay}
            defaultView={'day'}
            views={['week', 'day']}
            step={15}
            min={new Date('2018-03-02T16:00:00.113Z')}
            max={new Date('2018-03-02T04:00:00.113Z')}
            defaultDate={this.state.currDay}
          />
          <div className='container'></div>
        </div>
        <div id='calendars'>
          {
            this.state.totalRooms.map((x, i, arr) => {
              return <Calendar room={i} date={this.state.currDay} collectionSize={arr.length} />
            })
          }
        </div>
      </div>
    )
  }
};

export default CalendarCollection;
