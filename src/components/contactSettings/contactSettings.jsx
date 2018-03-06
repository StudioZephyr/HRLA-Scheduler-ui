import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getContacts, addContact, updateContact, deleteContact } from '../../actions/contactActions';

import './contactSettings.css';

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
    const { addContact, contacts, deleteContact, getContacts, id, updateContact, updated } = this.props;
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
      <div className="account-settings" >
        <div className="row justify-content-center">
          {
            updated && contacts.map((contact, i) => (
              <ContactView key={`contact-view-${id}-${i}`} contact={contact} updateContact={updateContact} id={id} deleteContact={deleteContact} />
            ))
          }
        </div>
        <div className="row contact-add justify-content-center">
          <div className="col col-lg-auto">
            {
              !addDisabled &&
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="contact-add-name">Name</label>
                  <input type="text" id="contact-add-name" className="form-control" onChange={(e) => {
                    this.setName(e.target.value);
                  }} />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-add-email">Email</label>
                  <input type="text" id="contact-add-email" className="form-control" onChange={(e) => {
                    this.setEmail(e.target.value);
                  }} />
                </div>
              </form>
            }
          </div>
          <div className="col col-lg-auto align-self-end">
            {
              !addDisabled &&
              <button className="btn btn-success contact-add-btn" onClick={(e) => {
                e.preventDefault();
                addContact({ name, email }, id);
                this.toggleAdd();
              }} >
                SUBMIT
              </button>
            }
            <button className="btn btn-info contact-add-btn" onClick={(e) => {
              e.preventDefault();
              this.toggleAdd();
            }} >
              { addDisabled ? 'ADD' : 'CANCEL' }
            </button>
          </div>
        </div>
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
    deleteContact: bindActionCreators(deleteContact, dispatch),
  }
};

export default connect(ContactState, ContactDispatch)(ContactSetting);
