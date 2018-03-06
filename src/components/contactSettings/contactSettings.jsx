import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getContacts, addContact, updateContact, deleteContact } from '../../actions/contactActions';

import './contactSettings.css';

import ContactView from './contactView.jsx';
import Loading from '../loading/loadingView.jsx';

class ContactSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    const { addContact, contacts, deleteContact, getContacts, id, updateContact, updated } = this.props;
    const { email, name } = this.state;

    if (!updated) {
      getContacts(id);
      return (
        <Loading />
      )
    }

    return (
      <div className="account-settings" >
        <div className="row contact-add justify-content-center">
          <div className="col col-lg-auto align-self-end">
            <button type="button" className="btn btn-info contact-add-btn" data-toggle="modal" data-target="#add-contact-modal" >
              ADD
            </button>
          </div>
        </div>
        <div className="row justify-content-center">
          {
            updated && contacts.map((contact, i) => (
              <ContactView key={`contact-view-${id}-${i}`} contact={contact} updateContact={updateContact} id={id} deleteContact={deleteContact} />
            ))
          }
        </div>
        <div className="modal fade" id="add-contact-modal" tabIndex="-1" role="dialog" aria-labelledby="add-contact-modal-label" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add-contact-modal-label">Add Contact</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
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
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                  CANCEL
                </button>
                <button className="btn btn-success" data-dismiss="modal"
                  onClick={(e) => {
                    e.preventDefault();
                    addContact({ name, email }, id);
                  }}
                >
                  SUBMIT
                </button>
              </div>
            </div>
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
