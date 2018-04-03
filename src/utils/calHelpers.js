import moment from 'moment-timezone';
const calHelpers = {

  selectRange: function (slot) {
    if (this.state.eventRow) {
      this.state.initEventRow = this.state.eventRow.slice();
    }
    if (this.props.user.id) {
      if (this.props.user.type !== 'admin') {
        const currentDate = moment().tz('America/Los_Angeles');
        const slotDate = moment(slot.start).tz('America/Los_Angeles');
        if (currentDate.date() !== slotDate.date() || currentDate.month() !== slotDate.month() || currentDate.year() !== slotDate.year()) {
          alert(`You may only create events on the current date ${currentDate.date()}/${currentDate.month()}/${currentDate.year()}`);
          return;
        }

        if (this.props.user.hasEvent) {
          alert('You already have an event scheduled.\nPlease wait for this event to expire, or reschedule it');
          return;
        }
      }
      let start = moment(slot.start).tz('America/Los_Angeles');
      let end = moment(slot.end).tz('America/Los_Angeles');
      let conflict;
      if (this.props.calType === 'day') {
        conflict = this.conflictCheck(start, end)
      }
      if (conflict) {
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
    else {
      alert('Please log in');
    }
  },

  createEvent: function () {
    const event = {
      title: this.state.purpose,
      start: this.state.selectedStart,
      end: this.state.selectedEnd,
      UserId: this.props.user.id,
      room: this.props.room ? this.props.room.name : this.state.selectedRoom.name
    }
    try {
      this.props.postAndRefresh(event, this.props.socket);
      if (this.props.room) {
        this.setState({
          initEventRow: this.state.eventRow.slice(),
        })
      }
      if (this.props.user.type !== 'admin') {
        this.state.eventCreated = true;
      }
    } catch (e) {
      alert('Time range invalid and overlapping existing events.');
    }
  },

  handlePurposeChange: function (e) {
    this.setState({
      purpose: e.target.value
    });
  },

  handleStartChange: function (e) {
    let newStart = moment(`${this.state.selectedDate} ${e.target.value} ${this.state.selectedStartAmPm}`, 'MM-DD-YYYY hh:mm a');
    if (this.state.selectedEnd - newStart <= 0 || newStart.hours() < 8) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    if (e.target.value === '') {
      newStart = moment(this.state.selectedEvent.start);
    }

    this.setState({
      startText: e.target.value,
      selectedStart: newStart,
    })
  },

  handleEndChange: function (e) {
    let newEnd = moment(`${this.state.selectedDate} ${e.target.value} ${this.state.selectedEndAmPm}`, 'MM-DD-YYYY hh:mm a');
    if (this.state.selectedStart - newEnd >= 0 || newEnd.hours() > 20 || (newEnd.hours() === 20 && newEnd.minutes() > 0)) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    if (e.target.value === '') {
      newEnd = moment(this.state.selectedEvent.end);
    }

    this.setState({
      endText: e.target.value,
      selectedEnd: newEnd
    })
  },

  handleStartAmPmChange: function (e) {
    let newStart = moment(`${this.state.selectedDate} ${this.state.selectedStart.format('hh:mm')} ${e.target.value}`, 'MM-DD-YYYY hh:mm a');
    if (this.state.selectedEnd - newStart <= 0 || newStart.hours() < 8 || newStart.hours() > 20 || (newStart.hours() === 20 && newStart.minutes() > 0)) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    this.setState({
      selectedStartAmPm: e.target.value,
      selectedStart: newStart
    })
  },

  handleEndAmPmChange: function (e) {
    let newEnd = moment(`${this.state.selectedDate} ${this.state.selectedEnd.format('hh:mm')} ${e.target.value}`, 'MM-DD-YYYY hh:mm a');
    if (this.state.selectedStart - newEnd >= 0 || newEnd.hours() < 8 || newEnd.hours() > 20 || (newEnd.hours() === 20 && newEnd.minutes() > 0)) {
      this.state.timeError = true;
    } else {
      this.state.timeError = false;
    }
    this.setState({
      selectedEndAmPm: e.target.value,
      selectedEnd: newEnd
    })
  },

  resetEventsRow: function () {
    this.setState({
      eventRow: this.state.initEventRow.slice()
    });
  },

  editEvent: function (selectedEvent) {

    if (this.props.user.id === selectedEvent.UserId || this.props.user.type === 'admin') {
      this.setState({
        selectedEvent: selectedEvent,
        purpose: selectedEvent.title,
        selectedStartAmPm: moment(selectedEvent.start).format('a'),
        selectedEndAmPm: moment(selectedEvent.end).format('a'),
        selectedStart: moment(selectedEvent.start),
        selectedEnd: moment(selectedEvent.end),
        selectedDate: moment(selectedEvent.start).format('MM-DD-YYYY')
      }, () => {
        this.props.getContacts(selectedEvent.UserId);
        $(`#${this.state.roomname}EditModal`).modal('show')
        $('[data-toggle="tooltip"]').tooltip()
      })
    }
  },

  saveChanges: function () {
    let newEvent = Object.assign({}, this.state.selectedEvent);
    newEvent.start = this.concatTimeMeridiem(this.state.selectedStart, this.state.selectedStartAmPm, this.state.selectedDate).toDate();
    newEvent.end = this.concatTimeMeridiem(this.state.selectedEnd, this.state.selectedEndAmPm, this.state.selectedDate).toDate();
    newEvent.title = this.state.purpose;

    //checks length of event to not exceed 2 hours for student groups
    // if (this.props.user.type !== 'admin') {
    //   let diffTime = this.state.selectedEvent.end.getTime() - this.state.selectedEvent.start.getTime();
    //   if (diffTime > 7200000) {
    //     alert('Please select a time range of 2 hours or less');
    //     this.state.selectedEvent.start = originalEvent.start;
    //     this.state.selectedEvent.end = originalEvent.end;
    //     this.setState({
    //       selectedEvent: originalEvent
    //     });
    //     return;
    //   }
    // }

    this.props.updateAndRefresh(newEvent, this.props.socket);
    this.resetSelected()
  },

  removeEvent: function () {
    this.props.deleteAndRefresh(this.state.selectedEvent, this.props.socket);
    this.resetSelected();
  },

  formatTime: function (time) {
    return moment(time).format('hh:mm');
  },

  concatTimeMeridiem(time, meridiem, date) {
    let year = this.props.currDate.year();
    let month = this.props.currDate.month() + 1;
    let day = this.props.currDate.date();
    return moment(`${date} ${time.hour()}:${time.minute()} ${meridiem} `, 'MM-DD-YYYY hh:mm a ');
  },

  title(event) {
    return `${event.desc} - ${event.title}`;
  },

  resetSelected() {
    this.setState({
      purpose: '',
      startText: '',
      endText: '',
      selectedStart: moment(),
      selectedEnd: moment(),
    })
  },

}

export default calHelpers;