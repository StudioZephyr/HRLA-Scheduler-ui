import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { refreshUser, postAndRefresh, updateAndRefresh, deleteAndRefresh } from '../../actions/authActions';
import { loadEvents } from '../../actions/calendarActions';
import calHelpers from '../../utils/calHelpers';

import EditModal from './modals/eventEditModal.jsx';
import PostModal from './modals/eventPostModal.jsx';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
      selectedDate: '',
      roomname: '',
      purpose: '',
      selectedEvent: {},
      eventCreated: false,
      selectedRoom: '',
      timeError: false,
      eventsUpdated: false,
      purposeText: '',
      startText: '',
      endText: ''
    }
    this.state.selectedEvent = { start: this.state.selectedStart, end: this.state.selectedStart }
    this.createEvent = calHelpers.createEvent.bind(this);
    this.resetEventsRow = this.resetEventsRow.bind(this);
    this.editEvent = calHelpers.editEvent.bind(this);
    this.selectRange = calHelpers.selectRange.bind(this);
    this.handlePurposeChange = calHelpers.handlePurposeChange.bind(this);
    this.handleStartChange = calHelpers.handleStartChange.bind(this);
    this.handleEndChange = calHelpers.handleEndChange.bind(this);
    this.handleStartAmPmChange = calHelpers.handleStartAmPmChange.bind(this);
    this.handleEndAmPmChange = calHelpers.handleEndAmPmChange.bind(this);
    this.concatTimeMeridiem = calHelpers.concatTimeMeridiem.bind(this);
    this.resetSelected = calHelpers.resetSelected.bind(this)
    this.formatTime = calHelpers.formatTime.bind(this);
    this.saveChanges = calHelpers.saveChanges.bind(this);
    this.removeEvent = calHelpers.removeEvent.bind(this);
    
  }

  componentDidMount() {
    console.log('mounting')
    this.state.eventCreated = this.props.user.hasEvent;
    this.assignEvents();
    if (this.state.eventsList) {
      this.renderDay();
    }
    this.setState({
      roomname: this.props.room.name.replace(/\s+/g, '')
    });
    document.getElementById(`${this.props.room.name}`)
      .getElementsByClassName('rbc-header')[0]
      .textContent = this.props.room.name === 'time' ? `Room` : `${this.props.room.name}` //replace room number with room name
  }

  componentDidUpdate(prevProps) {
    console.log('updating', prevProps)
    if (!this.props.eventsLoaded) {
      this.props.loadEvents();
      this.assignEvents();
      this.renderDay();
    }
    if (this.props.currDate.date() !== this.state.rowDate.date()) {
      this.renderDay();
      this.setState({
        rowDate: this.props.currDate
      })
    }
  }

  // componentWillReceiveProps() {
  //   this.renderDay();
  // }

  assignEvents() {
    let newList = this.props.eventList.toArray()
    newList = newList.map((event) => {
      return Object.assign({}, event);
    })
    this.setState({
      eventsList: newList
    });
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
    return (time.getHours() - 8) * 4 + (time.getMinutes() === 0 ? 0 : 1);
  }

  fillTimeSlot(startTime, endTime) {
    let startIdx = this.toIdx(startTime);
    let endIdx = this.toIdx(endTime);
    let initEventRow = this.state.eventRow.slice();
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
      if (start.getDate() === this.props.currDate.date() && start.getMonth() === this.props.currDate.month() && start.getFullYear() === this.props.currDate.year()) {
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
    let backgroundColor = event.finished === true ? 'rgba(34, 34, 34, 0.4)' : '#3174B6';
    let opacity = 0.8
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
    }, () => {
      this.resetSelected();
    });
  }

  render() {

    return (
      <div id={`${this.props.room.name}`} className='calendar'>
        {this.state.eventsList ?
          <BigCalendar
            selectable
            events={this.state.eventsList}
            view={this.props.calType}
            date={this.props.currDate}
            step={30}
            views={'day'}
            titleAccessor={calHelpers.title}
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
          resetEvents={this.resetEventsRow}
          startText={this.state.startText}
          endText={this.state.endText}

        />

      </div>
    )
  }
};

const DayCalendarState = (state) => {
  return {
    user: state.auth.user,
    eventsLoaded: state.calendar.eventsLoaded,
    socket: state.calendar.socket
  };
}

const DayCalendarDispatch = (dispatch) => {
  return {
    refreshUser: bindActionCreators(refreshUser, dispatch),
    loadEvents: bindActionCreators(loadEvents, dispatch),
    postAndRefresh: bindActionCreators(postAndRefresh, dispatch),
    updateAndRefresh: bindActionCreators(updateAndRefresh, dispatch),
    deleteAndRefresh: bindActionCreators(deleteAndRefresh, dispatch)
  };
}

export default connect(DayCalendarState, DayCalendarDispatch)(DayCalendar);

