import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getContacts, addContact, updateContact } from '../../actions/contactActions';

import ContactView from './contactView.jsx';

class ContactSetting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { addContact, contacts, getContacts, id, updateContact, updated } = this.props;

    if (!updated) {
      getContacts(id);
      return (
        <div>
          Updating...
        </div>
      )
    }

    return (
      <div>
        {
          updated && contacts.map((contact, i) => (
            <ContactView key={`contact-view-${id}-${i}`} contact={contact} updateContact={updateContact} id={id} />
          ))
        }
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
    addContact: bindActionCreators(addContact, dispatch),
    updateContact: bindActionCreators(updateContact, dispatch),
  }
};

export default connect(ContactState, ContactDispatch)(ContactSetting);
