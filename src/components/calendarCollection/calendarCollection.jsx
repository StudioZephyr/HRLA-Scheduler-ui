import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getEvents, getRooms } from '../../actions/calendarActions';
import DayCalendar from '../calendar/dayCalendar.jsx';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { Promise } from 'bluebird';

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
      // eventCreated: false
    }
    this.organizeEvents = this.organizeEvents.bind(this);
  }

  componentDidMount() {
    //REPLACING WITH ACTION
    axios.get(`${API_SERVER}/api/rooms`)
      .then(({ data }) => {
        this.setState({
          roomArray: this.state.roomArray.concat(data.result)
        })
        this.getEvents();
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

  getEvents() {
    return new Promise((resolve, reject)=> {
      this.state.eventsSorted = [];
      this.props.getEvents()
      console.log('this should be second')
      // .then((e) => {
      //   console.log('its a promise!', e)
      // })

      axios.get(`${API_SERVER}/api/timeslot`)
        .then(async ({ data }) => {
          console.log('data from get all timeslots', data)
          let events = data.result.map((event) => {
            event.start = moment(event.start).toDate();
            event.end = moment(event.end).toDate();
            event.desc = event.groupName;
            event.selectable;
            return event;
          });
          await this.setState({
            eventData: events,
            eventsSorted: []
          })
          this.organizeEvents();
          resolve()
        })
    })
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
    await this.getEvents();
    this.setState({
      calType: view
    });
  }

  organizeEvents() {
    if (this.state.eventData.length > 0) {
      this.state.eventData.forEach((event) => {
        this.state.roomArray.forEach((room, r) => {
          if (event.RoomId === room.id) {
            if (!this.state.eventsSorted[r]) {
              this.state.eventsSorted[r] = [];
            }
            this.state.eventsSorted[r].push(event);
          }
        })
      })
    }
    this.setState({
      eventsLoaded: true
    });
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
            step={30}
            min={new Date('2018-03-02T16:00:00.113Z')}
            max={new Date('2018-03-02T04:00:00.113Z')}
          />
          <div className='container'></div>
        </div>

        {
          this.state.eventsLoaded ?
            this.state.calType === 'day' ?
              <div id='calendars'>
                {/* change to toolbarcalendar component */}
                <DayCalendar room={{ name: 'time' }} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventData} />
                {this.state.roomArray.map((x, i, arr) => {
                  console.log('events in render:', this.state.eventData);
                  return <DayCalendar room={x} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventsSorted[i]} slotView={this.state.slotView} />
                })}
              </div>
              :
              <div id='weekCalendar'>
                {/* change to weekcalendar component */}
                <DayCalendar room={{ name: 'weeks' }} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventData} roomArray={this.state.roomArray} />
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
    user: state.auth.user
  };
}

const CalendarCollectionDispatch = (dispatch) => {
  return {
    getRooms: bindActionCreators(getRooms, dispatch),
    getEvents: bindActionCreators(getEvents, dispatch)
  }
}

export default connect(CalendarCollectionState, CalendarCollectionDispatch)(CalendarCollection);