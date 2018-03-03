import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getContacts } from '../../actions/contactActions';

class ContactSetting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { contacts, getContacts, id, updated } = this.props;

    if (!updated) {
      getContacts(id);
      return (
        <div>
          Updating...
        </div>
      )
    }

    console.log(contacts);

    return (
      <div>
        Contacts settings
      </div>
    )
  }
};

const ContactState = (state) => {
  return {
    contacts: state.contact.contacts,
    id: state.auth.user.id,
    updated: state.contact.contactsUpdated,
  }
};

const ContactDispatch = (dispatch) => {
  return {
    getContacts: bindActionCreators(getContacts, dispatch),
  }
};

export default connect(ContactState, ContactDispatch)(ContactSetting);
