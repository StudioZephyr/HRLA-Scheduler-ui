import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';

import { refreshUser } from '../../actions/authActions';
import { postEvent, eventsLoaded, updateEvent, deleteEvent } from '../../actions/calendarActions';

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
      modal: 'none'
    }
    // if (this.props.calType === 'weeks') {
    //   this.state.selectedRoom = this.props.roomArray[0];
    // };
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

  selectRange(slot) {
    this.state.initEventRow = this.state.eventRow.slice();
    if (this.props.user.id) {
      //SLOT IS DATE OBJ
      if (this.props.user.type !== 'admin' && slot.slots.length > 4) {
        //change to something prettier
        alert('Please select a time range of 2 hours or less')
      } else if (this.props.user.hasEvent && this.props.user.type !== 'admin') {
        alert('You already have an event scheduled.\nPlease wait for this event to expire, or reschedule it');
      } else {
        let start = moment(slot.start);
        let end = moment(slot.end);
        let fill = this.fillTimeSlot(start, end);
        if (!fill) {
          alert('Please select a valid time');
        } else {
          this.setState({
            selectedStart: start,
            selectedEnd: end
          }, () => {
            $(`#${this.state.roomname}Modal`).modal('show')
          })
        }
      }
    }
    else {
      //change to something prettier
      alert('Please log in');
    }
  }

  async createEvent() {
    const event = {
      title: this.state.purpose,
      start: this.state.selectedStart,
      end: this.state.selectedEnd,
      UserId: this.props.user.id, //grab this from state generated by auth
      room: this.props.room.name
    }
    try {
      this.props.postEvent(event, this.props.roomNo, event);
      this.props.refreshUser(this.props.user.id);
      this.setState({
        // eventsList: this.state.eventsList.concat(event),
        initEventRow: this.state.eventRow.slice(),
        eventsUpdated: false,
      })
      if (this.props.user.type !== 'admin') {
        this.state.eventCreated = true;
      }
    } catch (e) {
      alert('Time range invalid and overlapping existing events.');
    }
  }

  handlePurposeChange(e) {
    this.setState({
      purpose: e.target.value
    });
  }
//vvvv refactor 
  // selectTime(time, startOrEnd) {
  //   meridiem = startOrEnd === 'start' ? this.state.selectedStartAmPm : this.state.selectedEndAmPm;
  //   newTime = time || startOrEnd === 'start' ? this.state.selectedStart : this.state.selectedEnd
  //   let newStart = moment(`${newTime} ${meridiem}`, 'hh:mm a');
  //   if (startOrEnd === 'start'){
  //     if (this.state.selectedEvent.end - newStart <= 0 || newStart.hours() < 8) {
  //       this.state.timeError = true;
  //     } else {
  //       this.state.timeError = false;
  //     }
  //     this.setState({
  //       selectedStart: newStart,
  //     })
  //   } else {
  //     if (this.state.selectedEvent.start - newEnd >= 0 || newEnd.hours() > 20 || (newEnd.hours() === 20 && newEnd.minutes() > 0)) {
  //       this.state.timeError = true;
  //     } else {
  //       this.state.timeError = false;
  //     }
  //     this.setState({
  //       selectedEnd: newStart,
  //     })
  //   }
  // }

  handleStartChange(e) {
    let newStart = moment(`${e.target.value} ${this.state.selectedStartAmPm}`, 'hh:mm a');
    console.log('comparing', moment(this.state.selectedEvent.end), 'and>>>>>>>>>>>>>>>>', newStart, 'and the result=', moment(this.state.selectedEvent.end) - newStart)
    if (this.state.selectedEnd - newStart <= 0 || newStart.hours() < 8) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    if (e.target.value === '') {
      newStart = moment(this.state.selectedEvent.start);
    }

    this.setState({
      selectedStart: newStart,
    })
  }

  handleEndChange(e) {
    let newEnd = moment(`${e.target.value} ${this.state.selectedEndAmPm}`, 'hh:mm a');
    console.log('comparing', moment(this.state.selectedStart), 'and>>>>>>>>>>>>>>>>', newEnd, 'and the result=', moment(this.state.selectedEvent.Start) - newEnd)
    if (this.state.selectedStart - newEnd >= 0 || newEnd.hours() > 20 || (newEnd.hours() === 20 && newEnd.minutes() > 0)) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    if (e.target.value === '') {
      newEnd = moment(this.state.selectedEvent.end);
    }

    this.setState({
      selectedEnd: newEnd
    })
  }

  handleStartAmPmChange(e) {
    let newStart = moment(`${this.state.selectedStart.format('hh:mm')} ${e.target.value}`, 'hh:mm a');
    if (this.state.selectedEnd - newStart <= 0 || newStart.hours() < 8) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    this.setState({
      selectedStartAmPm: e.target.value,
      selectedStart: newStart
    })
  }

  handleEndAmPmChange(e) {
    let newEnd = moment(`${this.state.selectedEnd.format('hh:mm')} ${e.target.value}`, 'hh:mm a');
    console.log('comparing', moment(this.state.selectedStart), 'and>>>>>>>>>>>>>>>>', newEnd, 'and the result=', moment(this.state.selectedEvent.Start) - newEnd)
    if (this.state.selectedStart - newEnd >= 0 || newEnd.hours() > 20 || (newEnd.hours() === 20 && newEnd.minutes() > 0)) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    this.setState({
      selectedEndAmPm: e.target.value,
      selectedEnd: newEnd
    })
  }

  resetEventsRow() {
    this.setState({
      eventRow: this.state.initEventRow.slice()
    });
  }

  editEvent(selectedEvent) {
    if (this.props.user.id === selectedEvent.UserId || this.props.user.type === 'admin') {
      this.setState({
        selectedEvent: selectedEvent,
        purpose: selectedEvent.title,
        selectedStartAmPm: moment(selectedEvent.start).format('a'),
        selectedEndAmPm: moment(selectedEvent.end).format('a'),
        selectedStart: moment(selectedEvent.start),
        selectedEnd: moment(selectedEvent.end),
        modal: 'editing'
      }, () => {
        $(`#${this.state.roomname}EditModal`).modal('show')
      })
    }
  }

  saveChanges() {
    let originalEvent = Object.assign({}, this.state.selectedEvent);

    const newEvent = this.state.selectedEvent;
    newEvent.start = this.concatTimeMeridiem(this.state.selectedStart, this.state.selectedStartAmPm).toDate();
    newEvent.end = this.concatTimeMeridiem(this.state.selectedEnd, this.state.selectedEndAmPm).toDate();
    newEvent.title = this.state.purpose;

    //checks length of event Kan wants this gone
    if (this.props.user.type !== 'admin') {
      let diffTime = this.state.selectedEvent.end.getTime() - this.state.selectedEvent.start.getTime();
      if (diffTime > 7200000) {
        alert('Please select a time range of 2 hours or less');
        this.state.selectedEvent.start = originalEvent.start;
        this.state.selectedEvent.end = originalEvent.end;
        this.setState({
          selectedEvent: originalEvent
        });
        return;
      }
    }
    this.props.updateEvent(newEvent, this.props.roomNo);
  }

  deleteEvent() {
    this.props.deleteEvent;
    this.setState({
      selectedEvent: { start: moment(), end: moment() }
    })
  }

  formatTime(time) {
    return moment(time).format('hh:mm');
  }

  concatTimeMeridiem(time, meridiem) {
    let year = this.props.currDate.year();
    let month = this.props.currDate.month() + 1;
    let day = this.props.currDate.date();
    return moment(`${year}-${month}-${day} ${time.hour()}:${time.minute()} ${meridiem} `, 'YYYY-MM-DD hh:mm a ');
  }

  title(event) {
    return `${event.desc} - ${event.title}`;
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
            views={['week', 'day']}
            titleAccessor={this.title}
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
        {/* <div className="modal fade" id={`${this.state.roomname}Modal`} role='dialog' tabIndex="-1" ref={modal => this.modal = modal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.room.name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{`${this.state.selectedStart.format('hh:mm a')} - ${this.state.selectedEnd.format('hh:mm a')}`}</p>
                <form>
                  Description:<br />
                  <input id='eventNameInput' type='text' onChange={this.handlePurposeChange.bind(this)} />
                </form>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.createEvent} data-dismiss="modal">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={this.resetEventsRow} data-dismiss="modal" >Close</button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
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
          deleteEvent={this.deleteEvent}
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
    loadEvents: bindActionCreators(eventsLoaded, dispatch),
    deleteEvent: bindActionCreators(deleteEvent, dispatch)
  };
}

export default connect(DayCalendarState, DayCalendarDispatch)(DayCalendar);

