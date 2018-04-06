import Promise from 'bluebird';

const recieveAddedEvent = (event) => (dispatch) => {
  dispatch({ type: `SOCKET_POST`, payload: event });
};

const recieveUpdatedEvent = (event) => (dispatch) => {
  dispatch({ type: `SOCKET_UPDATE`, payload: event });
};

const recieveDeleteEvent = (event) => (dispatch) => {
  dispatch({ type: `SOCKET_DELETE`, payload: event });
};

const eventRefresh = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch({ type: `SOCKET_EVENT_REFRESH`, resolve });
  })
}

const userRefresh = (events) => (dispatch) => {
  dispatch({ type: `SOCKET_USER_REFRESH`, events });
}

const recieveRefreshRequest = () => (dispatch) => {
    return dispatch(eventRefresh()).then((eventState) => {
      return dispatch(userRefresh(eventState));
  })
}

export { recieveAddedEvent, recieveUpdatedEvent, recieveDeleteEvent, recieveRefreshRequest };