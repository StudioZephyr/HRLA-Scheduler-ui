import moment from 'moment';
import { Map, List } from 'immutable';
import { addEvent, updateEvent, deleteEvent } from '../utils/calenderReducerHelpers.js';
import io from 'socket.io-client/dist/socket.io.js';
const API_SOCKET = process.env.API_SOCKET;

const initialState = {
  events: [],
  rooms: [],
  eventsLoaded: false,
  roomsLoaded: false,
  socket: io(API_SOCKET)
}

const calendarReducer = (state = initialState, action) => {
  const payload = action.payload;

  switch (action.type) {

    case `ROOM_GET_SUCCESS`: {
      return Object.assign({}, state, {
        rooms: payload,
      });
    }

    case `EVENTS_GET_SUCCESS`: {
      let eventsSorted = List();
      const eventsUnsorted =
        payload.map((event) => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          event.desc = event.groupName;
          event.selectable;
          return event;
        }) || [];

      state.rooms.forEach((room, r) => {
        if (typeof eventsSorted[r] !== 'object') {
          eventsSorted = eventsSorted.withMutations((list) => {
            list.push(List([]));
          })
        }
      });

      if (eventsUnsorted.length > 0) {
        eventsUnsorted.forEach((event) => {
          state.rooms.forEach((room, r) => {
            if (event.RoomId === room.id) {
              eventsSorted = eventsSorted.update(r, (val) => {
                return val.withMutations((list) => {
                  event.roomNo = r;
                  list.push(event);
                })
              })
            }
          })
        })
      }

      return Object.assign({}, state, {
        events: eventsSorted
      });

    }
    case `EVENTS_GET_FAILED`: {
      return state;
    }

    case `EVENT_POST_SUCCESS`: {
      const payload = action.payload;
      const event = action.event;
      const roomNo = state.rooms.findIndex(r => r.id === payload.RoomId);
      event.id = payload.id;
      event.desc = payload.groupName;
      event.UserId = payload.UserId;
      event.RoomId = payload.RoomId;
      event.start = new Date(payload.start);
      event.end = new Date(payload.end);
      event.roomNo = roomNo;
      event.finished = false;
      const newEvents = addEvent(event, state);
      action.socket.emit('clientEventPost', event);
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      });
    }

    case `EVENTS_LOADED`: {
      return Object.assign({}, state, {
        eventsLoaded: true
      })
    }

    case `ROOMS_LOADED`: {
      return Object.assign({}, state, {
        roomsLoaded: true
      });
    }

    case `EVENT_UPDATE_SUCCESS`: {
      const event = action.event;
      event.roomNo = state.rooms.findIndex(r => r.id === event.RoomId);
      action.socket.emit('clientEventUpdate', event);
      const newEvents = updateEvent(event, state);
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      });
    }

    case `EVENT_DELETE_SUCCESS`: {
      const event = action.event;
      event.roomNo = state.rooms.findIndex(r => r.id === event.RoomId);
      action.socket.emit('clientEventDelete', event);
      const newEvents = deleteEvent(event, state)
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      });
    }

    case `ROOM_ADD`: {
      const payload = action.payload;
      const newEvents = state.events.push(List([]));
      return Object.assign({}, state, {
        events: newEvents,
        rooms: state.rooms.concat(payload)
      });
    }

    case `ROOM_DELETE`: {
      const id = action.payload;
      const rooms = state.rooms
      let idx = 0
      rooms.forEach((room, i) => {
        if (room.id === id) {
          idx = i;
        }
      });

      rooms.splice(idx, 1);
      const newEvents = state.events.delete(idx);

      return Object.assign({}, state, {
        events: newEvents,
        rooms: rooms
      });
    }

    case `SOCKET_POST`: {
      const event = action.payload;
      event.start = new Date(event.start);
      event.end = new Date(event.end);
      const newEvents = addEvent(event, state);
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      });
    }

    case `SOCKET_UPDATE`: {
      const event = action.payload;
      event.start = new Date(event.start);
      event.end = new Date(event.end);
      const newEvents = updateEvent(event, state);
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      });
    }

    case `SOCKET_DELETE`: {
      const newEvents = deleteEvent(action.payload, state);
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      });
    }

    default: {
      return state;
    }
  }
}

export { calendarReducer };