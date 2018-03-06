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
      optionList: [],
      view: 'booked'
    }
  }

  componentDidMount() {
    // this.props.events.forEach((event) => {
    //   console.log('comparison',event, this.props.room.id)
    //   if (event.RoomId === this.props.room.id) {
    //     this.setState({
    //       roomEvents: 
    //       this.state.roomEvents.push({
    //         title: event.title,
    //         start: new Date(event.start),
    //         end: new Date(event.end)
    //       })
    //     })
    //   }
    // })
    this.renderDay();
    this.setState({
      eventsList: this.state.eventsList
    });
    document.getElementById(`${this.props.room.name}`)
    .getElementsByClassName('rbc-header')[0]
    .textContent = this.props.room.name === 'time' ? `Room` : `${this.props.room.name}` //replace room number with room name
  }

  componentDidUpdate() {
    if (this.props.slotView !== this.state.view){
      this.selectEvents()
      this.setState({
        view: this.props.slotView
      })
    }
    if (this.props.currDate.date() !== this.state.rowDate.date()) {
      console.log('updating date');
      this.renderDay();
      this.setState({
        rowDate: this.props.currDate
      })
      console.log('event list>>>>>>', this.state.eventsList)
    }
  }

  toTime(idx) {
    return moment({
      year: this.props.currDate.year(),
      month: this.props.currDate.month(),
      date: this.props.currDate.date(),
      hour: Math.floor(idx / 2) + 8,
      minute: idx % 2 === 0 ? 0 : 30
    }).toDate()
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
    console.log('attemptin to block todays events')
    this.props.events.forEach((event) => {
      if (event.start.getDate() === this.props.currDate.date() && event.start.getMonth() === this.props.currDate.month() && event.start.getFullYear() === this.props.currDate.year()) {
        this.fillTimeSlot(event.start, event.end);
      }
    })
  }

  populateEventOptions () {
    this.state.eventRow.forEach((spot, i, arr) => {
      if (spot === 0){
        let slotSize = 1;
        if (arr[i + 1] === 0 && i % 2 === 0) {
          slotSize = 2;
        }
        let startTime = this.toTime(i)
        let endTime = this.toTime(i + slotSize)

        this.fillTimeSlot(startTime, endTime)

        this.state.optionList.push({
          id: 'openSlot',
          title: 'Available Slot',
          start: startTime,
          end: endTime
        })
      }
    })
  }

  resetEvents () {
      this.state.eventRow = new Array(24).fill(0)
  }

  selectEvents() {
    console.log('selecint events with options as',this.state.optionList, 'and switch set to', this.props.slotView)
    if (this.props.slotView === 'booked') {
      this.state.eventsList = this.props.events.slice()
    } else {
      this.state.eventsList = this.state.optionList.slice();
    }
  }

  renderDay () {
    this.resetEvents();
    this.blockTodaysEvents();
    this.populateEventOptions();
    this.selectEvents();
  }

  eventStyles (event, start, end, isSelected) {
    //check docs on eventPropGetter

    //blue #3174B6
    // lightgray
    let backgroundColor = event.id === 'openSlot' ? 'rgba(34, 34, 34, 0.09)' : '#3174B6';
    let opacity = event.id === 'openSlot' ? 0.8 : 0.8;
    let color = event.id === 'openSlot' ? '#3174B6' : 'lightgray';
    let borderRadius = event.id === 'openSlot' ? '0px' : '5px';
    let style = {
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        opacity: opacity,
        color: color,
        border: '1px solid #eaf6ff',
        display: 'block'
    };
    return {
        style: style
    };

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
          eventPropGetter = {this.eventStyles}
        />
      : 
      <p>Loading</p>
      }
      </div>
    )
  }
};

export default Calendar;
