import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { refreshUser } from '../../actions/authActions';
import { postEvent, loadEvents, updateEvent, deleteEvent } from '../../actions/calendarActions';
import calUtils from './calUtils.js';

import EditModal from './eventEditModal.jsx';
import PostModal from './eventPostModal.jsx';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './calendar.css';
const API_SERVER = process.env.API_SERVER;

class DayCalendar extends Component {
  constructor(props) {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      eventRow: new Array(24).fill(0), //array length should be length of day in hours * 2
      initEventRow: [],
      rowDate: props.currDate,
      eventsList: [],
      selectedStart: moment(),
      selectedEnd: moment(),
      selectedStartAmPm: 'am',
      selectedEndAmPm: 'am',
      roomname: '',
      purpose: '',
      selectedEvent: {},
      eventCreated: false,
      selectedRoom: '',
      timeError: false,
      eventsUpdated: false,
    }
    this.state.selectedEvent = { start: this.state.selectedStart, end: this.state.selectedStart }
    this.createEvent = calUtils.createEvent.bind(this);
    this.resetEventsRow = this.resetEventsRow.bind(this);
    this.editEvent = calUtils.editEvent.bind(this);
    this.selectRange = calUtils.selectRange.bind(this);
    this.handlePurposeChange = calUtils.handlePurposeChange.bind(this);
    this.handleStartChange = calUtils.handleStartChange.bind(this);
    this.handleEndChange = calUtils.handleEndChange.bind(this);
    this.handleStartAmPmChange = calUtils.handleStartAmPmChange.bind(this);
    this.handleEndAmPmChange = calUtils.handleEndAmPmChange.bind(this);
    this.concatTimeMeridiem = calUtils.concatTimeMeridiem.bind(this);
    this.formatTime = calUtils.formatTime.bind(this);
    this.saveChanges = calUtils.saveChanges.bind(this);
    this.removeEvent = calUtils.removeEvent.bind(this);
  }

  componentDidMount() {
    console.log('MADE IT', this.props.eventList);
    this.state.eventCreated = this.props.user.hasEvent;
    this.assignEvents();
    console.log('INSIDE COMPONENT DID MOUNT', this.state.eventsList)
    if (this.state.eventsList) {
      // this.renderDay();
    }
    this.setState({
      roomname: this.props.room.name.replace(/\s+/g, '')
    });
    document.getElementById(`${this.props.room.name}`)
      .getElementsByClassName('rbc-header')[0]
      .textContent = this.props.room.name === 'time' ? `Room` : `${this.props.room.name}` //replace room number with room name
  }

  componentDidUpdate(prevProps) {
    console.log('this updated and the props are', this.props.eventList, 'in room', this.props.roomNo);
    if (!this.props.eventsLoaded) {
      this.props.loadEvents()
      this.assignEvents()
    }
    if (this.props.currDate.date() !== this.state.rowDate.date()) {
      console.log('updating date');
      // this.renderDay();
      this.setState({
        rowDate: this.props.currDate
      })
    }
  }

  assignEvents() {
    console.log('converting list:', ...this.props.eventList)
    this.state.eventsList = this.props.eventList.toArray()
    this.state.eventsList = this.state.eventsList.map((event) => {
      event.start = new Date(event.start);
      event.end = new Date(event.end);
      return event;
    })
    this.setState({
      eventsUpdated: true
    })
  }

  toTime(idx) {
    return moment({
      year: this.props.currDate.year(),
      month: this.props.currDate.month(),
      date: this.props.currDate.date(),
      hour: Math.floor(idx / 4) + 8,
      minute: idx % 2 === 0 ? 0 : 30
    }).toDate()
  }

  toIdx(time) {
    return (time.hours() - 8) * 4 + (time.minutes() === 0 ? 0 : 1);
  }

  fillTimeSlot(startTime, endTime) {
    let startIdx = this.toIdx(startTime);
    let endIdx = this.toIdx(endTime);
    let initEventRow = this.state.eventRow.slice();
    console.log('fill start time of ', startTime.hours(), 'in room', this.props.room)
    for (let i = startIdx; i < endIdx; i++) {
      if (this.state.eventRow[i] === 1) {
        this.state.eventRow = initEventRow.slice();
        return false;
      }
      this.state.eventRow[i] = 1;
    }
    return true;
  }

  blockTodaysEvents() {
    this.state.eventsList.forEach((event) => {
      let start = event.start;
      let end = event.end;
      console.log('looking at blocking start:', start, 'end:', end)
      if (start.date() === this.props.currDate.date() && start.month() === this.props.currDate.month() && start.year() === this.props.currDate.year()) {
        this.fillTimeSlot(start, end);
      }
    })
  }

  resetEvents() {
    this.state.eventRow = new Array(24).fill(0)
  }


  renderDay() {
    this.resetEvents();
    if (this.state.eventsList) {
      this.blockTodaysEvents();
    }
    this.state.initEventRow = this.state.eventRow.slice();
  }

  eventStyles(event, start, end, isSelected) {
    let backgroundColor = event.id === 'openSlot' ? 'rgba(34, 34, 34, 0.09)' : '#3174B6';
    let opacity = event.id === 'openSlot' ? 0.8 : 0.8;
    let color = event.id === 'openSlot' ? '#3174B6' : 'lightgray';
    let borderRadius = event.id === 'openSlot' ? '0px' : '5px';
    let style = {
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
      opacity: 0.8,
      color: color,
      border: '1px solid #eaf6ff',
      display: 'block',
    };
    return {
      style: style
    };
  }

  resetEventsRow() {
    this.setState({
      eventRow: this.state.initEventRow.slice()
    });
  }

  render() {

    return (
      <div id={`${this.props.room.name}`} className='calendar'>
        {console.log('INSIDE THE RENDER OF DAYCALENDAR', this.state.eventsList)}
        {this.state.eventsList ?
          <BigCalendar
            selectable
            events={this.state.eventsList}
            view={this.props.calType}
            date={this.props.currDate}
            step={30}
            views={'day'}
            titleAccessor={calUtils.title}
            min={new Date('2018-03-02T16:00:00.113Z')}
            max={new Date('2018-03-02T04:00:00.113Z')}
            defaultDate={new Date(2018, 2, 2)}
            eventPropGetter={this.eventStyles}
            onSelectEvent={this.editEvent}
            onSelectSlot={this.selectRange}
          />
          :
          <p>Loading</p>
        }
        <PostModal
          roomName={this.state.roomname}
          selectedStart={this.state.selectedStart}
          selectedEnd={this.state.selectedEnd}
          handlePurposeChange={this.handlePurposeChange}
          createEvent={this.createEvent}
          resetEventsRow={this.resetEventsRow}
          room={this.props.room.name}
        />
 
        <EditModal
          start={this.state.selectedEvent.start}
          end={this.state.selectedEvent.end}
          desc={this.state.selectedEvent.desc}
          purpose={this.state.purpose}
          roomName={this.state.roomname}
          selectedEndAmPm={this.state.selectedEndAmPm}
          selectedStartAmPm={this.state.selectedStartAmPm}
          timeError={this.state.timeError}
          handlePurposeChange={this.handlePurposeChange}
          handleEndAmPmChange={this.handleEndAmPmChange}
          handleEndChange={this.handleEndChange}
          handleStartAmPmChange={this.handleStartAmPmChange}
          handleStartChange={this.handleStartChange}
          formatTime={this.formatTime}
          removeEvent={this.removeEvent}
          saveChanges={this.saveChanges}
          resetEventsRow={this.resetEventsRow}
        />

      </div>
    )
  }
};

const DayCalendarState = (state) => {
  return {
    user: state.auth.user,
    eventsLoaded: state.calendar.eventsLoaded,
  };
}

const DayCalendarDispatch = (dispatch) => {
  return {
    refreshUser: bindActionCreators(refreshUser, dispatch),
    postEvent: bindActionCreators(postEvent, dispatch),
    updateEvent: bindActionCreators(updateEvent, dispatch),
    loadEvents: bindActionCreators(loadEvents, dispatch),
    deleteEvent: bindActionCreators(deleteEvent, dispatch)
  };
}

export default connect(DayCalendarState, DayCalendarDispatch)(DayCalendar);

