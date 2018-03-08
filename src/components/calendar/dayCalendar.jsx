import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

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
      view: 'booked',
      selectedStart: '',
      selectedEnd: '',
      selectedStartAmPm: 'am',
      selectedEndAmPm: 'am',
      roomname: '',
      purpose: '',
      selectedEvent: {}
    }
    this.state.selectedEvent = { start: this.state.selectedStart, end: this.state.selectedStart }
    this.createEvent = this.createEvent.bind(this);
    this.resetEventsRow = this.resetEventsRow.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.selectRange = this.selectRange.bind(this);
    this.handlePurposeChange = this.handlePurposeChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleStartAmPmChange = this.handleStartAmPmChange.bind(this);
    this.handleEndAmPmChange = this.handleEndAmPmChange.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
  }

  componentDidMount() {
    console.log('looking at user', this.props.user)
    this.state.eventsList = this.props.events,
      this.renderDay();
    this.setState({
      roomname: this.props.room.name.replace(/\s+/g, '')
    });
    document.getElementById(`${this.props.room.name}`)
      .getElementsByClassName('rbc-header')[0]
      .textContent = this.props.room.name === 'time' ? `Room` : `${this.props.room.name}` //replace room number with room name
  }

  componentDidUpdate() {
    if (this.props.currDate.date() !== this.state.rowDate.date()) {
      console.log('updating date');
      this.renderDay();
      this.setState({
        rowDate: this.props.currDate
      })
    }
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
    console.log('fill start time of ', startTime.getHours(), 'in room', this.props.room)
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
    console.log('attemptin to block todays events', this.props.events)
    this.state.eventsList.forEach((event) => {
      let start = event.start;
      let end = event.end
      console.log('looking at blocking start:', start, 'end:', end)
      if (start.getDate() === this.props.currDate.date() && start.getMonth() === this.props.currDate.month() && start.getFullYear() === this.props.currDate.year()) {
        console.log('filling slotttt')
        this.fillTimeSlot(start, end);
      }
    })
  }

  resetEvents() {
    this.state.eventRow = new Array(24).fill(0)
  }


  renderDay() {
    this.resetEvents();
    this.blockTodaysEvents();
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

  selectRange(slot) {
    console.log('filling slots with', slot.start, slot.end)
    let fill = this.fillTimeSlot(slot.start, slot.end);
    if (!fill) {
      alert('Please select a valid time');
    } else {

      this.setState({
        selectedStart: slot.start,
        selectedEnd: slot.end
      })
      console.log(this.state.roomname)
      $(`#${this.state.roomname}Modal`).modal('show')
    }
  }

  async createEvent() {
    const event = {
      title: this.state.purpose,
      start: this.state.selectedStart,
      end: this.state.selectedEnd,
      username: this.props.user.groupName, //grab this from state generated by auth
      room: this.props.room.name
    }

    let result= await axios.post(`${API_SERVER}/api/timeslot`, (event))
    event.id = result.data.result.id;
    this.setState({
      eventsList: this.state.eventsList.concat(event),
      initEventRow: this.state.eventRow.slice()
    })
  }

  handlePurposeChange(e) {
    this.setState({
      purpose: e.target.value
    });
  }

  handleStartChange(e) {
    console.log('converting e:', e.target.value, '  to >>>>', moment(`${e.target.value} ${this.state.selectedStartAmPm}`, 'hh:mm a'))
    this.setState({
      selectedStart: moment(`${e.target.value} ${this.state.selectedStartAmPm}`, 'hh:mm a')
    })
    console.log('the start state changed to', this.state.selectedStart)
  }

  handleEndChange(e) {
    this.setState({
      selectedEnd: moment(`${e.target.value} ${this.state.selectedendAmPm}`, 'hh:mm a')
    })
  }

  handleStartAmPmChange(e) {
    this.setState({
      selectedStartAmPm: e.target.value
    })
  }

  handleEndAmPmChange(e) {
    this.setState({
      selectedEndAmPm: e.target.value
    })
  }

  resetEventsRow() {
    this.setState({
      eventRow: this.state.initEventRow.slice()
    });
  }

  editEvent(selectedEvent) {
    console.log(selectedEvent, this.props.user)
    if (this.props.user.id === selectedEvent.UserId || this.props.user.type === 'admin') {
      this.setState({
        selectedEvent: selectedEvent,
        purpose: selectedEvent.title,
        selectedStartAmPm: moment(selectedEvent.start).format('a'),
        selectedEndAmPm: moment(selectedEvent.end).format('a'),
        selectedStart: moment(selectedEvent.start),
        selectedEnd: moment(selectedEvent.end)
      })
      console.log(selectedEvent)
      $(`#${this.state.roomname}EditModal`).modal('show')
    }
  }

  saveChanges() {
    console.log('attempting to save changes as', this.state.selectedEnd, this.state.selectedStart)
    this.state.selectedEvent.start = this.state.selectedStart.toDate();
    this.state.selectedEvent.end = this.state.selectedEnd.toDate();
    this.state.selectedEvent.title = this.state.purpose;
    this.setState({})
    console.log('selectedsevent state post save', this.state.selectedEvent)
    axios.put(`${API_SERVER}/api/timeslot/${this.state.selectedEvent.id}`, this.state.selectedEvent)
  }

  async deleteEvent() {
    await axios.delete(`${API_SERVER}/api/timeslot/${this.state.selectedEvent.id}`, this.state.selectedEvent)
    // delete this.state.selectedEvent;
    console.log(this.state.eventsList)
    this.state.eventsList.forEach((event, i) => {
      if (event.id === this.state.selectedEvent.id) {
        delete this.state.eventsList[i];
      }
    })
    this.setState({
      selectedEvent: { start: moment(), end: moment() }
    })
  }

  formatTime(time) {
    console.log(time)
    if (typeof time === 'object') {
      return moment(time).format('hh:mm');
    }
  }

  render() {

    return (
      <div id={`${this.props.room.name}`} className='calendar'>
        {console.log('EVENTLIST IN DAYCALENDAR RENDER', this.state.eventsList)}
        {this.props.currDate ?
          <BigCalendar
            selectable
            events={this.state.eventsList}
            view={this.props.calType}
            date={this.props.currDate}
            step={30}
            views={['week', 'day']}
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
        <div className="modal fade" id={`${this.state.roomname}Modal`} role='dialog' tabIndex="-1" ref={modal => this.modal = modal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.room.name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{`${this.state.selectedStart.toLocaleString()} - ${this.state.selectedEnd.toLocaleString()}`}</p>
                <form>
                  Purpose:<br />
                  <input id='eventNameInput' type='text' onChange={this.handlePurposeChange.bind(this)} />
                </form>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.createEvent} data-dismiss="modal">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={this.resetEventsRow} data-dismiss="modal" >Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* VVVV EDIT EVENT MODAL VVVV */}
        <div className="modal fade" id={`${this.state.roomname}EditModal`} role='dialog' ref={modal => this.modal = modal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Event</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">

                <form>
                  Purpose:<br />
                  <input id='eventNameInput' type='text' placeholder={this.state.purpose} onChange={this.handlePurposeChange} /> <br />
                  Start:<br />
                  <input id='eventStartInput' type='text' placeholder={this.formatTime(this.state.selectedEvent.start)} onChange={this.handleStartChange} />
                  <div className='btn-group'>
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {this.state.selectedStartAmPm}
                    </button>
                    <h8>hh:mm</h8>
                    <div className="dropdown-menu">
                      <option onClick={this.handleStartAmPmChange} >am</option>
                      <option onClick={this.handleStartAmPmChange} >pm</option>
                    </div>
                  </div>
                  <br />
                  End: <br />
                  <input id='eventEndInput' type='text' placeholder={this.formatTime(this.state.selectedEvent.end)} onChange={this.handleEndChange} />
                  <div className='btn-group'>
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {this.state.selectedEndAmPm}
                    </button>
                    <h8>hh:mm</h8>
                    <div className="dropdown-menu">
                      <option onClick={this.handleEndAmPmChange} >am</option>
                      <option onClick={this.handleEndAmPmChange} >pm</option>
                    </div>
                  </div>
                </form>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.deleteEvent} data-dismiss="modal">Delete event</button>
                  <button type="button" className="btn btn-secondary" onClick={this.saveChanges} data-dismiss="modal">Save Changes</button>
                  <button type="button" className="btn btn-secondary close" onClick={this.resetEventsRow} data-dismiss="modal" >Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
};

const DayCalendarState = (state) => {
  return {
    user: state.auth.user
  }
}


export default connect(DayCalendarState)(DayCalendar);
