import React, { Component } from 'react';
import axios from 'axios';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './calendar.css';
const API_SERVER = process.env.API_SERVER;

class Calendar extends Component {
  constructor(props) {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      eventRow: new Array(24).fill(0), //array length should be length of day in hours * 2
      rowDate: props.currDate,
      eventsList: [],
    }
  }

  componentDidMount() {
    this.props.events.forEach((event) => {
      console.log('comparison',event, this.props.room.id)
      if (event.RoomId === this.props.room.id) {
        this.setState({
          eventsList: 
          this.state.eventsList.push({
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end)
          })

        })
      }
    })
    console.log('eventlist for room>>>', this.props.room.id , this.state.eventsList)

    this.setState({
      eventsList: this.state.eventsList
    })
    
    document.getElementById(`${this.props.room.name}`)
    .getElementsByClassName('rbc-header')[0]
    .textContent = this.props.room.name === 'time' ? `Room` : `${this.props.room.name}` //replace room number with room name
  }

  componentDidUpdate() {
    if (this.props.currDate.date() !== this.state.rowDate.date()) {
      console.log('updating date');
      this.blockTodaysEvents();
      console.log('checking row data', this.state.eventRow);
      this.setState({
        rowDate: this.props.currDate
      })
    }
  }



  toIdx(time) {
    return (time.getHours() - 8) * 2 + (time.getMinutes() === 0 ? 0 : 1);
  }

  fillTimeSlot(startTime, endTime) {
    let startIdx = this.toIdx(startTime);
    let endIdx = this.toIdx(endTime);
    console.log('fill start time of ',startTime.getHours(), 'in room', this.props.room)
    for (let i = startIdx; i < endIdx; i++){
      this.state.eventRow[i] = 1;
    }
  }

  blockTodaysEvents() {
    this.state.eventsList.forEach((event) => {
      if (event.start.getDate() === this.props.currDate.date() && event.start.getMonth() === this.props.currDate.month() && event.start.getFullYear() === this.props.currDate.year()) {
        this.fillTimeSlot(event.start, event.end);
      }
    })

  }

  render() {

    return (
      <div id={`${this.props.room.name}`} className='calendar'>
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
