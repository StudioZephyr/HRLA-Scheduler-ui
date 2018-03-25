import axios from 'axios';

const API_SERVER = process.env.API_SERVER;

const getRooms = () => (dispatch) => {
  axios.get(`${API_SERVER}/api/rooms`)
    .then(({ data }) => {
      dispatch({ type: 'ROOM_GET_SUCCESS', payload: data.result });
    })
    .catch(err => {
      console.log(`Error getting Rooms. ${err.message}`);
      dispatch({ type: 'ROOM_GET_FAILED' }, null);
    })
}


const getEvents = () => (dispatch) => {
  axios.get(`${API_SERVER}/api/timeslot`)
    .then(({ data }) => {
      dispatch({ type: 'EVENTS_GET_SUCCESS', payload: data.result });
    })
    .catch(err => {
      console.log(`Error getting Events. ${err.message}`);
      dispatch({ type: 'EVENTS_GET_FAILED' }, null)
    })
}


const postEvent = (event, socket) => (dispatch) => {
  axios.post(`${API_SERVER}/api/timeslot`, (event))
  .then(({ data }) => {
    console.log('here is that data', data);
    dispatch({ type: 'EVENT_POST_SUCCESS', payload: data.result, event, socket});
  })
  .catch(err => {
    console.log(`Error getting Events. ${err.message}`);
    dispatch({ type: 'EVENT_POST_FAILED' });
  })
}


const loadEvents = () => (dispatch) => {
  dispatch({ type: 'EVENTS_LOADED' });
}

const loadRooms = () => (dispatch) => {
  dispatch({ type: 'ROOMS_LOADED' });
}

const updateEvent = (event) => (dispatch) => {
  axios.put(`${API_SERVER}/api/timeslot/${event.id}`, event)
    .then(({ data }) => {
      console.log('event updated', data);
      dispatch({ type: 'EVENT_UPDATE_SUCCESS', payload: data.result, event });
    })
    .catch(err => {
      console.log(`Error getting Events. ${err.message}`);
      dispatch({ type: 'EVENT_UPDATE_FAILED' });
    })
}


const deleteEvent = (event) => (dispatch) => {
  axios.delete(`${API_SERVER}/api/timeslot/${event.id}`, event)
    .then(({ data }) => {
      dispatch({ type: 'EVENT_DELETE_SUCCESS', payload: data.result, event });
    })
    .catch(err => {
      dispatch({ type: 'EVENT_DELETE_FAILED' });
    })
}

const addRoomToCalendar = (roomObj) => (dispatch) => {
  dispatch({ type: 'ROOM_ADD', payload: roomObj });
}

const deleteRoomFromCalendar = (roomId) => (dispatch) => {
  dispatch({ type: 'ROOM_DELETE', payload: roomId });
}


export { getRooms, getEvents, postEvent, updateEvent, deleteEvent, loadEvents, loadRooms, addRoomToCalendar, deleteRoomFromCalendar };