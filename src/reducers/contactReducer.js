const initialState = {
  contacts: [],
  contactsUpdated: false,
};

const contactsReducer = (state=initialState, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `CONTACTS_GET_SUCCESS`: {
      return Object.assign({}, state, {
        contacts: payload,
        contactsUpdated: true,
      });
    }
    case `CONTACTS_GET_FAILED`: {
      return Object.assign({}, state, {
        contacts: [],
        contactsUpdated: false,
      });
    }
    default: {
      return state;
    }
  }
};

export { contactsReducer };
