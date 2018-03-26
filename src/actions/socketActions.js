const recieveAddedEvent = (event) => (dispatch) => {
  dispatch({ type: `SOCKET_POST`, payload: event });
};

const recieveUpdatedEvent = (event) => (dispatch) => {
  dispatch({ type: `SOCKET_UPDATE`, payload: event });
};

const recieveDeleteEvent = (event) => (dispatch) => {
  dispatch({ type: `SOCKET_DELETE`, payload: event });
};

export {recieveAddedEvent, recieveUpdatedEvent, recieveDeleteEvent};