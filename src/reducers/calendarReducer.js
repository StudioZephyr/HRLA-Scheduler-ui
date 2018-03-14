import moment from 'moment';

const initialState = {
  events: [],
  rooms: []
}

const calendarReducer = (state=initialState, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `ROOM_GET_SUCCESS`: {
      return Object.assign({}, state, {
        rooms: payload
      })
    }
    case `EVENTS_GET_SUCCESS`: {
      console.log('this should be first')
      return Object.assign({}, state, {
        events: payload.map((event) => {
          event.start = moment(event.start).toDate();
          event.end = moment(event.end).toDate();
          event.desc = event.groupName;
          event.selectable;
          return event;
        })
      })
    }
    default: {
      return state;
    }
  }
}

export { calendarReducer };