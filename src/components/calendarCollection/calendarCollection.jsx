import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getEvents, getRooms, loadEvents, loadRooms } from '../../actions/calendarActions';
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
const API_SOCKET = process.env.API_SOCKET;

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
      // eventCreated: false
    }
  }

  componentWillMount() {
    this.setState({
      socket: io(API_SOCKET)
    }) 
  }

  componentDidMount() {
    this.state.socket.on('eventPosted', (event) => {
      this.props.recieveAddedEvent(event);
    })
    this.state.socket.on('eventUpdated', (event) => {
      this.props.recieveUpdatedEvent(event);
    })
    this.state.socket.on('eventDeleted', (event) => {
      console.log('DELETING IN SOCKET', event)
      this.props.recieveDeleteEvent(event);
    })
    //REPLACING WITH ACTION
    // axios.get(`${API_SERVER}/api/rooms`)
    this.props.getRooms()


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

  componentDidUpdate(prevProps) {
    console.log('component did indeed update', prevProps)
    if (this.props.rooms.length !== prevProps.rooms.length) {
      this.props.getEvents()
    }
    
    if (!this.props.roomsLoaded && this.props.events.length !== prevProps.events.length ) {
      let events = this.props.events;
      console.log('here are the events', events);
      this.props.loadRooms();  
      // console.log(events.get(0), 'events got 0, no error');
      console.log('events updated too!', this.props.events, prevProps.events);
      this.setState({
        eventsLoaded: true
      })
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
    const { events, rooms, eventsLoaded } = this.props;
    if (this.state.eventsLoaded) {
      console.log('props in render', this.props.events, this.props.rooms);
    }
    return (
      <div id='calendarCollection'>
          {console.log('events in the return', events)}
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
                <DayCalendar room={{ name: 'time' }} currDate={this.state.currDay} calType={this.state.calType} eventList={events.get(0)} />
                {rooms.map((x, i, arr) => {
                  console.log('events in render', events.get(i))
                  return <DayCalendar room={x} roomNo = {i} currDate={this.state.currDay} calType={this.state.calType} slotView={this.state.slotView} eventList={events.get(i)} socket={this.state.socket} />
                })}
              </div>
              :
              <div id='weekCalendar'>
                <WeekCalendar currDate={this.state.currDay} calType={this.state.calType} eventsList={events} roomArray={this.state.roomArray} socket={this.state.socket} />
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
    rooms: state.calendar.rooms,
    events: state.calendar.events,
    eventsLoaded: state.calendar.eventsLoaded,
    roomsLoaded: state.calendar.roomsLoaded
  };
}

const CalendarCollectionDispatch = (dispatch) => {
  return {
    getRooms: bindActionCreators(getRooms, dispatch),
    getEvents: bindActionCreators(getEvents, dispatch),
    loadEvents: bindActionCreators(loadEvents, dispatch),
    loadRooms: bindActionCreators(loadRooms, dispatch),
    recieveAddedEvent: bindActionCreators(recieveAddedEvent, dispatch), 
    recieveUpdatedEvent: bindActionCreators(recieveUpdatedEvent, dispatch), 
    recieveDeleteEvent: bindActionCreators(recieveDeleteEvent, dispatch)
  }
}

export default connect(CalendarCollectionState, CalendarCollectionDispatch)(CalendarCollection);