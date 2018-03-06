import React, { Component } from 'react';
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
      optionList: [],
      view: 'booked',
      selectedStart: '',
      selectedEnd: '',
      roomname: ''
    }
  }

  componentDidMount() {
    this.renderDay();
    this.setState({
      eventsList: this.state.eventsList,
      roomname: this.props.room.name.replace(/\s+/g, '')
    });
    document.getElementById(`${this.props.room.name}`)
      .getElementsByClassName('rbc-header')[0]
      .textContent = this.props.room.name === 'time' ? `Room` : `${this.props.room.name}` //replace room number with room name
  }

  componentDidUpdate() {
    if (this.props.slotView !== this.state.view) {

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
    let initEventRow = this.state.eventRow.slice();
    console.log('fill start time of ', startTime.getHours(), 'in room', this.props.room)
    for (let i = startIdx; i < endIdx; i++) {
      if (this.state.eventRow[i] === 1) {
        this.state.eventRow = initEventRow;
        return false;
      }
      this.state.eventRow[i] = 1;
    }
    return true;
  }

  blockTodaysEvents() {
    console.log('attemptin to block todays events', this.props.events)
    this.props.events.forEach((event) => {
      let start = event.start;
      let end = event.end
      if (start.getDate() === this.props.currDate.date() && start.getMonth() === this.props.currDate.month() && start.getFullYear() === this.props.currDate.year()) {
        this.fillTimeSlot(start, end);
      }
    })
  }

  populateEventOptions() {
    //remove this when click to create events works
    this.state.eventRow.forEach((spot, i, arr) => {
      if (spot === 0) {
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
          end: endTime,
          action: 'select'
        })
      }
    })
  }

  resetEvents() {
    this.state.eventRow = new Array(24).fill(0)
    this.state.optionList = [].slice();
    this.state.eventsList = [].slice();
  }

  selectEvents() {
    console.log('selecint events with options as', this.state.optionList, 'and switch set to', this.props.slotView)
    if (this.props.slotView === 'booked') {
      this.state.eventsList = this.props.events.slice()
    } else {
      this.state.eventsList = this.state.optionList.slice();
    }
  }

  renderDay() {
    this.resetEvents();
    this.blockTodaysEvents();
    this.state.initEventRow = this.state.eventRow;
    // this.populateEventOptions();
    this.selectEvents();
  }

  eventStyles(event, start, end, isSelected) {
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

  selectRange(slot) {
    console.log('filling slots with', slot.start, slot.end)
    let fill = this.fillTimeSlot(slot.start, slot.end);
    if (!fill) {
      alert('Please select a valid time');
    } else {

      this.setState({
        selectedStart: slot.start.toLocaleString(),
        selectedEnd: slot.end.toLocaleString()
      })
      console.log(this.state.roomname)
      $(`#${this.state.roomname}Modal`).modal('show')
    }
  }

  createEvent() {
    axios.post(`${API_SERVER}/api/timeslot`, ({
      title: $('#eventNameInput').val(),
      start: this.state.selectedStart,
      end: this.state.selectedEnd,
      username: 'HRLA Admin', //grab this from state generated by auth
      room: this.props.room.name
    }))
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
            step={15}
            views={['week', 'day']}
            min={new Date('2018-03-02T16:00:00.113Z')}
            max={new Date('2018-03-02T04:00:00.113Z')}
            defaultDate={new Date(2018, 2, 2)}
            eventPropGetter={this.eventStyles}
            onSelectSlot={this.selectRange.bind(this)}
          />
          :
          <p>Loading</p>
        }
        <div className="modal fade" id={`${this.state.roomname}Modal`} role='dialog' ref={modal => this.modal = modal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.props.room.name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{`${this.state.selectedStart} - ${this.state.selectedEnd}`}</p>
                <form>
                  Purpose:<br/>
                  <input id='eventNameInput' type='text' />
                </form>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.createEvent.bind(this)} data-dismiss="modal">Submit</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
};

export default DayCalendar;
