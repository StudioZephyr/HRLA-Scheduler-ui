import React, { Component } from 'react';

import Calendar from '../calendar/calendar.jsx';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendarCollection.css';
const API_SERVER = process.env.API_SERVER;

class CalendarCollection extends Component {
  constructor() {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      totalRooms: new Array(5).fill('filler'), //make number refer to a dynamic property on props
      calType: 'day',
      currDay: moment(),
      eventData: []
    }
  }

  componentDidMount() {

    axios.get(`${API_SERVER}/api/rooms`)
      .then(({ data }) => {
        this.setState({
          eventData: data
        })
      })

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
      <div id='calendarCollection'>
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
        {
          this.state.calType === 'day' ?
          <div id='calendars'>
            {this.state.totalRooms.map((x, i, arr) => {
              return <Calendar room={i} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventData} />
              })}
              </div>
            :
            <div id='weekCalendar'>
              <Calendar room={'weeks'} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventData} />
            </div>
        }
      </div>
    )
  }
};

export default CalendarCollection;
