import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getContacts, addContact, updateContact } from '../../actions/contactActions';

import ContactView from './contactView.jsx';

class ContactSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addDisabled: true,
      name: '',
      email: '',
    };
  }

  setEmail(text) {
    this.setState({
      email: text,
    });
  }

  setName(text) {
    this.setState({
      name: text,
    });
  }

  toggleAdd() {
    this.setState({
      addDisabled: !this.state.addDisabled,
    });
  }

  render() {
    const { addContact, contacts, getContacts, id, updateContact, updated } = this.props;
    const { addDisabled, email, name } = this.state;

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
        {
          !addDisabled &&
          <form>
            <input type="text" placeholder={'Name'} onChange={(e) => {
              this.setName(e.target.value);
            }} />
            <input type="text" placeholder={'Email'} onChange={(e) => {
              this.setEmail(e.target.value);
            }} />
            <button onClick={(e) => {
              e.preventDefault();
              addContact({ name, email }, id);
              this.toggleAdd();
            }} >
              SUBMIT
            </button>
          </form>
        }
        <button onClick={(e) => {
          e.preventDefault();
          this.toggleAdd();
        }} >
          { addDisabled ? 'ADD' : 'CANCEL' }
        </button>
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
