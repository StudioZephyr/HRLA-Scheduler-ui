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
      calType: 'day',
      currDay: moment()
    }
  }

  componentDidMount() {

    //overrides date control on toolbar
    document.getElementsByClassName('rbc-btn-group')[0]
      .getElementsByTagName('button')[0]
      .onclick = () => { this.dayReset() }

    document.getElementsByClassName('rbc-btn-group')[0]
      .getElementsByTagName('button')[1]
      .onclick = () => { this.dayBack() }

    document.getElementsByClassName('rbc-btn-group')[0]
      .getElementsByTagName('button')[2]
      .onclick = () => { this.dayForward() }

    //overrides view control on toolbar
    document.getElementsByClassName('rbc-btn-group')[1]
      .getElementsByTagName('button')[0]
      .onclick = () => { this.changeView('week') }

    document.getElementsByClassName('rbc-btn-group')[1]
      .getElementsByTagName('button')[1]
      .onclick = () => { this.changeView('day') }

  }

  dayReset() {
    this.setState({
      currDay: moment()
    })
  }

  dayBack() {
    this.setState({
      currDay: moment(this.state.currDay).subtract(1, this.state.calType + 's')
    })
  }

  dayForward() {
    this.setState({
      currDay: moment(this.state.currDay).add(1, this.state.calType + 's')
    })
  }

  changeView(view) {
    this.setState({
      calType: view
    })
  }

  render() {
    return (
      <div>
        {console.log('currday', this.state.currDay)}
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
          />
          <div className='container'></div>
        </div>
        <div id='calendars'>
          {
            this.state.calType === 'day' ?
              this.state.totalRooms.map((x, i, arr) => {
                return <Calendar room={i} currDate={this.state.currDay} calType={this.state.calType} />
              })
              :
              <Calendar room={0} date={this.state.currDay} type={this.state.type} />
          }
        </div>
      </div>
    )
  }
};

export default CalendarCollection;
