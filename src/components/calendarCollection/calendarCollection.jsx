import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getEvents, getRooms, loadEvents, loadRooms } from '../../actions/calendarActions';
import { getContacts } from '../../actions/contactActions';
import { recieveAddedEvent, recieveUpdatedEvent, recieveDeleteEvent } from '../../actions/socketActions';
import DayCalendar from '../calendar/dayCalendar.jsx';
import WeekCalendar from '../calendar/weekCalendar.jsx';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { Promise } from 'bluebird';
import io from 'socket.io-client/dist/socket.io.js';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendarCollection.css';

const API_SERVER = process.env.API_SERVER;


class CalendarCollection extends Component {
  constructor() {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
      roomArray: [],
      calType: 'day',
      currDay: moment(),
      eventData: [],
      eventsLoaded: false,
      eventsSorted: [],
      slotView: 'booked',
      bookingText: 'Book a Room',
      socket: null
    }
  }

  componentDidMount() {
    this.props.socket.removeAllListeners();
    this.props.socket.on('eventPosted', (event) => {
      this.props.recieveAddedEvent(event);
    })
    this.props.socket.on('eventUpdated', (event) => {
      this.props.recieveUpdatedEvent(event);
    })
    this.props.socket.on('eventDeleted', (event) => {
      this.props.recieveDeleteEvent(event);
    })
    this.props.getRooms();


    //overrides date control on toolbar
    document.getElementsByClassName('rbc-btn-group')[0]
      .getElementsByTagName('button')[0]
      .onclick = () => { this.dayReset() };

    document.getElementsByClassName('rbc-btn-group')[0]
      .getElementsByTagName('button')[1]
      .onclick = () => { this.dayBack() };

    document.getElementsByClassName('rbc-btn-group')[0]
      .getElementsByTagName('button')[2]
      .onclick = () => { this.dayForward() };

    //overrides view control on toolbar
    document.getElementsByClassName('rbc-btn-group')[1]
      .getElementsByTagName('button')[0]
      .onclick = () => { this.changeView('week') };

    document.getElementsByClassName('rbc-btn-group')[1]
      .getElementsByTagName('button')[1]
      .onclick = () => { this.changeView('day') };

  }

  componentDidUpdate(prevProps) {
    if (this.props.rooms.length !== prevProps.rooms.length) {
      this.props.getEvents()
    }

    if (!this.props.roomsLoaded && this.props.events.length !== prevProps.events.length) {
      let events = this.props.events;
      this.props.loadRooms();
      this.setState({
        eventsLoaded: true
      });
    }
  }

  dayReset() {
    this.setState({
      currDay: moment()
    });
  }

  dayBack() {
    this.setState({
      currDay: moment(this.state.currDay).subtract(1, this.state.calType + 's')
    });
  }

  dayForward() {
    this.setState({
      currDay: moment(this.state.currDay).add(1, this.state.calType + 's')
    });
  }

  async changeView(view) {
    this.setState({
      calType: view
    });
  }


  render() {
    const { events, rooms, eventsLoaded, getContacts } = this.props;
    if (this.state.eventsLoaded) {
    }
    return (
      <div id='calendarCollection'>
        <div id='calendarNav'>
          <div className='container'></div>
          <BigCalendar
            events={[]}
            date={this.state.currDay}
            defaultView={'day'}
            views={['week', 'day']}
            step={30}
            min={new Date('2018-03-02T16:00:00.113Z')}
            max={new Date('2018-03-02T04:00:00.113Z')}
          />
          <div className='container'></div>
        </div>

        {
          this.props.roomsLoaded ?
            this.state.calType === 'day' ?
              <div id='calendars'>
                {/* change to toolbarcalendar component */}
                <DayCalendar
                  room={{ name: 'time' }}
                  currDate={this.state.currDay}
                  calType={this.state.calType}
                  eventList={events.get(0)}
                />
                {rooms.map((x, i, arr) => {
                  return (
                  <DayCalendar
                    room={x}
                    roomNo={i}
                    currDate={this.state.currDay}
                    calType={this.state.calType}
                    slotView={this.state.slotView}
                    eventList={events.get(i)}
                    getContacts={getContacts}
                  />
                )
                })}
              </div>
              :
              <div id='weekCalendar'>
                <WeekCalendar
                  currDate={this.state.currDay}
                  calType={this.state.calType}
                  eventsList={events}
                  roomArray={this.state.roomArray}
                  getContacts={getContacts}
                />
              </div>
            :
            <div>
              Loading...
            </div>
        }

      </div>
    )
  }
};

const CalendarCollectionState = (state) => {
  return {
    user: state.auth.user,
    id: state.auth.id,
    rooms: state.calendar.rooms,
    events: state.calendar.events,
    eventsLoaded: state.calendar.eventsLoaded,
    roomsLoaded: state.calendar.roomsLoaded,
    socket: state.calendar.socket,
  };
}

const CalendarCollectionDispatch = (dispatch) => {
  return {
    getRooms: bindActionCreators(getRooms, dispatch),
    getEvents: bindActionCreators(getEvents, dispatch),
    loadRooms: bindActionCreators(loadRooms, dispatch),
    loadEvents: bindActionCreators(loadEvents, dispatch),
    recieveAddedEvent: bindActionCreators(recieveAddedEvent, dispatch),
    recieveUpdatedEvent: bindActionCreators(recieveUpdatedEvent, dispatch),
    recieveDeleteEvent: bindActionCreators(recieveDeleteEvent, dispatch),
    getContacts: bindActionCreators(getContacts, dispatch)
  }
}

export default connect(CalendarCollectionState, CalendarCollectionDispatch)(CalendarCollection);