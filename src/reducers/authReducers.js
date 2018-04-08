const initialState = {
  user: {},
  authorized: false,
};

const authReducer = (state=initialState, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `LOGIN_SUCCESS`: {
      return Object.assign({}, state, {
        user: payload,
        authorized: true,
      });
    }
    case `LOGIN_FAILED`: {
      return Object.assign({}, state, {
        authorized: false,
      });
    }
    case `LOGOUT_SUCCESS`: {
      return Object.assign({}, state, {
        user: {},
        authorized: false,
      });
    }
    case 'UPDATE_SUCCESS': {
      return Object.assign({}, state, {
        user: payload,
      });
    }
    case 'UPDATE_FAILED': {
      return state;
    }
    case 'USER_RETRIEVED': {
      return Object.assign({}, state, {
        user: payload
      })
    }
    case 'USER_RETRIEVAL_FAILED': {
      return state;
    }
    case'SOCKET_USER_REFRESH': {
      const events= action.events;
      let hasEvent = false;
      events.forEach((room) => {
        room.forEach((event) => {
          if ( !event.finished && event.UserId === state.user.id ) {
            hasEvent = true;
          }
        })
      })
      return Object.assign({}, state, {
        user: Object.assign({}, state.user, {
          hasEvent: hasEvent
        })
      });
    }
    default: {
      return state;
    }
  }
};

export { authReducer };
