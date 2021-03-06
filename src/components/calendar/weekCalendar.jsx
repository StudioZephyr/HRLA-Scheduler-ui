import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';

import { refreshUser, postAndRefresh, updateAndRefresh, deleteAndRefresh } from '../../actions/authActions';
import { loadEvents } from '../../actions/calendarActions';
import { loadContacts } from '../../actions/contactActions';
import calHelpers from '../../utils/calHelpers';

import EditModal from './modals/eventEditModal.jsx';
import PostModal from './modals/eventPostModal.jsx';
import Legend from '../legend/legend.jsx';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const API_SERVER = process.env.API_SERVER;

class WeekCalendar extends Component {
  constructor(props) {
    super();
    BigCalendar.momentLocalizer(moment);
    this.state = {
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
      selectedRoom: { name: 'Please Select a Room' },
      roomSelected: false,
      colors: ['#3174B6', '#B531B6', '#B67331', '#31B631', '#31B6AF', '#B63131', '#E1F5CE', '#F5CFCE', '#E2CEF5'],
      shownEvents: [],
      filteredRoomNo: null,
      editAuthorized: false,
    }

    this.createEvent = calHelpers.createEvent.bind(this);
    this.editEvent = calHelpers.editEvent.bind(this);
    this.selectRange = calHelpers.selectRange.bind(this);
    this.handlePurposeChange = calHelpers.handlePurposeChange.bind(this);
    this.handleStartChange = calHelpers.handleStartChange.bind(this);
    this.handleEndChange = calHelpers.handleEndChange.bind(this);
    this.handleStartAmPmChange = calHelpers.handleStartAmPmChange.bind(this);
    this.handleEndAmPmChange = calHelpers.handleEndAmPmChange.bind(this);
    this.formatTime = calHelpers.formatTime.bind(this);
    this.saveChanges = calHelpers.saveChanges.bind(this);
    this.concatTimeMeridiem = calHelpers.concatTimeMeridiem.bind(this);
    this.removeEvent = calHelpers.removeEvent.bind(this);
    this.resetSelected = calHelpers.resetSelected.bind(this)
    this.handleRoomSelect = this.handleRoomSelect.bind(this);
    this.eventStyles = this.eventStyles.bind(this);
    this.filterRooms = this.filterRooms.bind(this);
    this.selectRoomFilter = this.selectRoomFilter.bind(this);
    this.parseContacts = calHelpers.parseContacts.bind(this);
  }

  componentDidMount() {
    this.flattenEvents();
  }

  componentDidUpdate() {
    if (!this.props.eventsLoaded) {
      this.flattenEvents();
    }
    if (this.props.contactsUpdated) {
      this.props.loadContacts();
    }
  }

  flattenEvents() {
    let events = new Array();
    this.props.eventsList.forEach((list) => {
      let newArr = list.toArray();
      events = events.concat(newArr);
    });
    this.setState({
      eventsList: events
    }, () => {
      this.filterRooms()
    });
  }

  eventStyles(event, start, end, isSelected) {
    let expiredColor = 'rgba(34, 34, 34, 0.09)';
    let opacity = 0.8;
    let colors = this.state.colors;
    let borderRadius = '5px';
    let style = {
      backgroundColor: event.finished === false ? colors[event.roomNo] : expiredColor,
      borderRadius: borderRadius,
      opacity: 0.8,
      color: 'lightgrey',
      border: '1px solid #eaf6ff',
      display: 'block',
    };
    return {
      style: style
    };
  }

  handleRoomSelect(room) {
    this.setState({
      selectedRoom: room,
      roomSelected: true
    })
  }

  selectRoomFilter(roomIdx) {
    this.setState({
      filteredRoomNo: roomIdx
    }, () => {
      this.filterRooms();
    });
  }

  filterRooms() {
    const roomIdx = this.state.filteredRoomNo
    if (typeof roomIdx === 'number') {
      const events = this.state.eventsList.filter((event) => {
        return event.roomNo === roomIdx;
      })
      this.setState({
        shownEvents: events || []
      }, () => {
        this.props.loadEvents();
      })
    } else {
      this.setState({
        shownEvents: this.state.eventsList
      }, () => {
        this.props.loadEvents();
      })
    }
  }

  render() {
    return (
      <div id={`weeks`} className='calendar'>
        {this.state.eventsList ?
          <BigCalendar
            selectable
            events={this.state.shownEvents}
            view={this.props.calType}
            date={this.props.currDate}
            step={30}
            views={'week'}
            titleAccessor={calHelpers.title}
            min={new Date('2018-03-02T16:00:00.113Z')}
            max={new Date('2018-03-02T04:00:00.113Z')}
            defaultDate={new Date(2018, 2, 2)}
            eventPropGetter={this.eventStyles}
            onSelectEvent={this.editEvent}
            onSelectSlot={this.selectRange}
            formats={{dayFormat: 'MM/DD' + ' ' + 'ddd'}}

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
          resetEventsRow={() => { }}
          room={null}
          rooms={this.props.rooms}
          selectedRoom={this.state.selectedRoom}
          roomSelected={this.state.roomSelected}
          handleRoomSelect={this.handleRoomSelect}
          colors={this.state.colors}
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
          resetEvents={this.resetSelected}
          participants={this.parseContacts()}
          editAuthorized={this.state.editAuthorized}
        />

        <Legend
          rooms={this.props.rooms}
          colors={this.state.colors}
          filter={this.selectRoomFilter}
        />
      </div>
    )
  }
}


const WeekCalendarState = (state) => {
  return {
    user: state.auth.user,
    eventsLoaded: state.calendar.eventsLoaded,
    rooms: state.calendar.rooms,
    socket: state.calendar.socket,
    contacts: state.contact.contacts,
    contactsUpdated: state.contact.contactsUpdated
  };
}

const WeekCalendarDispatch = (dispatch) => {
  return {
    refreshUser: bindActionCreators(refreshUser, dispatch),
    loadEvents: bindActionCreators(loadEvents, dispatch),
    postAndRefresh: bindActionCreators(postAndRefresh, dispatch),
    updateAndRefresh: bindActionCreators(updateAndRefresh, dispatch),
    deleteAndRefresh: bindActionCreators(deleteAndRefresh, dispatch),
    loadContacts: bindActionCreators(loadContacts, dispatch),
  };
}

export default connect(WeekCalendarState, WeekCalendarDispatch)(WeekCalendar);

