import moment from 'moment';
import { Map, List } from 'immutable';

const initialState = {
  events: [],
  rooms: [],
  eventsLoaded: false,
  roomsLoaded: false
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
          event.start = event.start;
          event.end = event.end;
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
      const roomNo = state.rooms.findIndex(r=> r.name === event.room);
      event.id = payload.id;
      event.desc = payload.groupName;
      event.UserId = payload.UserId;
      event.RoomId = payload.RoomId;
      event.start = new Date(payload.start);
      event.end = new Date(payload.end);
      event.roomNo = roomNo;
      const newEvents = state.events.update(roomNo, (val) => {
        return val.push(event);
      })
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
      })
    }

    case `EVENT_UPDATE_SUCCESS`: {
      const event = action.event;
      const roomNo = state.rooms.findIndex(r=> r.name === event.room);
      const deepList = state.events.get(roomNo);
      const idx = deepList.findIndex((i)=> {
        console.log('comparison ocurring', i.id, event.id)
        return i.id === event.id;
      })
      console.log('HERE IS THE IDX', idx)
      const newEvents = state.events.updateIn([roomNo, idx], (value) => {
        return value = event;
      })
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      })
    }

    case `EVENT_DELETE_SUCCESS`: {
      const event = action.event;
      const roomNo = state.rooms.findIndex(r=> r.name === event.room);
      const deepList = state.events.get(roomNo);
      const idx = deepList.findIndex((i)=> {
        return i.id === event.id;
      })
      const newEvents = state.events.deleteIn([roomNo, idx]);
      return Object.assign({}, state, {
        events: newEvents,
        eventsLoaded: false
      })
    }

    case `ROOM_ADD`: {
      const payload = action.payload;
      const newEvents = state.events.push(List([]));
      console.log('ROOM ADDED', newEvents);
      return Object.assign({}, state, {
        events: newEvents,
        rooms: state.rooms.concat(payload)
      })
    }

    case `ROOM_DELETE`: {
      const id = action.payload;
      const rooms = state.rooms
      let idx = 0
      rooms.forEach((room, i) => {
        if (room.id === id) {
          idx = i;
        }
      })

      rooms.splice(idx, 1);
      const newEvents = state.events.delete(idx);
      console.log('newEvents', newEvents)

      return Object.assign({}, state, {
        events: newEvents,
        rooms: rooms
      })
    }

    default: {
      return state;
    }
  }
}

export { calendarReducer };