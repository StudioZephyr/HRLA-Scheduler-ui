import React, { Component } from 'react';

import DayCalendar from '../calendar/dayCalendar.jsx';

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
      roomArray: [],
      calType: 'day',
      currDay: moment(),
      eventData: [],
      eventsLoaded: false,
      eventsSorted: [],
      slotView: 'booked',
      bookingText: 'Book a Room'
    }
  }

  componentDidMount() {
    axios.get(`${API_SERVER}/api/rooms`)
      .then(({ data }) => {
        this.setState({
          roomArray: this.state.roomArray.concat(data.result)
        })
        console.log('here is the new state', this.state.roomArray)
        axios.get(`${API_SERVER}/api/timeslot`)
          .then(({ data }) => {
            let events = data.result.map((event)=> {
              event.start = moment(event.start).toDate();
              event.end = moment(event.end).toDate();
              return event
            })
            this.setState({
              eventData: events,
            })
            console.log('event in calcoll', this.state.eventData)
          })
      })

    //^^^^^^^^ recomment in when connected to internet
    //vvvvvvvv remove after
    

    console.log('state of events in CDM', this.state.eventData)


    //^^^^^^^^^ remove
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

  organizeEvents() {
    if (this.state.eventData.length > 0){
      console.log('initing org events', this.state.eventData)
      // this.state.eventsSorted = new Array(this.state.roomArray.lenth).fill([].slice())
      console.log(this.state.eventsSorted)
      this.state.eventData.forEach((event) => {
        console.log('foreach event', event)
        this.state.roomArray.forEach((room, r) => {
          console.log('comparin in calcol', event.RoomId, room.id);
          if (event.RoomId === room.id) {
            if (!this.state.eventsSorted[r]) {
              this.state.eventsSorted[r] = []
            }
            this.state.eventsSorted[r].push(event)
          }
        })
      })
      console.log('sorted events', this.state.eventsSorted);
      this.setState({
        eventsLoaded: true
      })
    }
  }

  toggleSlotView() {
    console.log('toggling')
  this.setState({
      bookingText: this.state.slotView === 'booked' ? 'Cancel' : 'Book a Room',
      slotView: this.state.slotView === 'booked' ? 'available' : 'booked'
    })
  }


  render() {
    return (
      <div id='calendarCollection'>
        {console.log('rendering with this as eventdata', this.state.eventData)}
        <div id='calendarNav'>
          <div className='container'></div>
          <span className='rbc-toolbar' id='slotViewToggler'>
          <button onClick={()=> {this.toggleSlotView()}}>{this.state.bookingText}</button>
          </span>
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
          this.state.eventsLoaded ?
            this.state.calType === 'day' ?
              <div id='calendars'>
              {/* change to toolbarcalendar component */}
                <DayCalendar room={{ name: 'time' }} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventData} />
                {this.state.roomArray.map((x, i, arr) => {
                  console.log('events in render:', this.state.eventData);
                  return <DayCalendar room={x} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventsSorted[i]} slotView={this.state.slotView}/>
                })}
              </div>
              :
              <div id='weekCalendar'>
              {/* change to weekcalendar component */}
                <DayCalendar room={{ name: 'weeks' }} currDate={this.state.currDay} calType={this.state.calType} events={this.state.eventData} />
              </div>
            :
            <div>
              Loading...

              {this.organizeEvents()}
            </div>
        }

        
        </div>
    )
  }
};

export default CalendarCollection;
