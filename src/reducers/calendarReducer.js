import moment from 'moment';
import { Map, List } from 'immutable';

const initialState = {
  events: [],
  rooms: [],
  eventsLoaded: false
}

const calendarReducer = (state = initialState, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `ROOM_GET_SUCCESS`: {
      // Object.assign({}, state, {
      //   rooms: payload
      // })
      return Object.assign({}, state, {
        rooms: payload,
      });
    }
    case `EVENTS_GET_SUCCESS`: {
      let eventsSorted = List();
      console.log('roooooms', state.rooms)
      const eventsUnsorted =
        payload.map((event) => {
          event.start =event.start;
          event.end = event.end;
          event.desc = event.groupName;
          event.selectable;
          return event;
        }) || [];

        state.rooms.forEach((room, r) => {
          if (typeof eventsSorted[r] !== 'object') {
            eventsSorted = eventsSorted.withMutations((list)=> {
              list.push(List([]));
            }) 
          }
        });

        console.log('events unsorted', eventsUnsorted);
        console.log('SKELETON OF SORTED', eventsSorted);
        
        if (eventsUnsorted.length > 0) {
          eventsUnsorted.forEach((event) => {
            state.rooms.forEach((room, r) => {
              if (event.RoomId === room.id) {
                console.log('here is updating to eventsorted', event)
                // eventsSorted.update(r, (val) => {
                //   console.log('here be that val', val)
                //  val.push(1);
                //   console.log('and then..', val);
                //   // return newVal;
                // })
                eventsSorted = eventsSorted.update(r, (val) => {
                                 console.log('here be that val', val)
                  return val.withMutations((list)=> {
                    list.push(event);
                  })
                })
              }
            })
          })
        }
        console.log('SORTED', ...eventsSorted);

        console.log('EVENTS IN REDUCER AFTER EVERYTHING', eventsSorted)
        return Object.assign({}, state, {
          events: eventsSorted
        });

    }
    case `EVENTS_GET_FAILED`: {
      return state;
    }

    case `EVENT_POST_SUCCESS`: {
      //action.roomNo
      const roomNo = action.roomNo;
      const payload = action.payload;
      const event = action.event;
      event.id = payload.id;
      event.desc = payload.groupName;
      event.UserId = payload.UserId;
      event.RoomId = payload.RoomId;
      event.start = new Date(payload.start);
      event.end = new Date(payload.end);
      console.log('before adding', state.events.get(roomNo))
      const newEvents = state.events.update(roomNo, (val) => {
        console.log('list tobe updated', ...val, 'roomno', roomNo)
        // return val.withMutations((list)=> {
          return val.push(event);
        // })
      })
      console.log('after adding', newEvents, ...newEvents.get(roomNo))
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

    default: {
      return state;
    }
  }
}

export { calendarReducer };