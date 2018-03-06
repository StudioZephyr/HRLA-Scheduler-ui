import React, { Component } from 'react';

import ContactInfo from './contactInfo.jsx';

class ContactView extends Component {
  constructor(props) {
    super(props);

    const { name, email } = this.props.contact;

    this.state = {
      name,
      email,
      editDisabled: true,
    };

    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
  }

  setName(text) {
    this.setState({
      name: text,
    });
  }

  setEmail(text) {
    this.setState({
      email: text,
    });
  }

  toggleEdit() {
    this.setState({
      editDisabled: !this.state.editDisabled,
    });
  }

  render() {
    const { editDisabled, email, name } = this.state;
    const { contact, id, updateContact, deleteContact } = this.props;

    return (
      <div className="col col-lg-auto col-contact-edit">
        <ContactInfo editDisabled={editDisabled} name={name} email={email}
          setEmail={this.setEmail}
          setName={this.setName}
        />
        {
          !editDisabled &&
          <button className="btn btn-success contact-btn" onClick={(e) => {
            e.preventDefault();
            updateContact({ email, name, UserId: id }, contact.id);
            this.toggleEdit();
          }} >
            SUBMIT
          </button>
        }
        <button className="btn btn-primary contact-btn" onClick={(e) => {
          e.preventDefault();
          this.toggleEdit();
        }} >
          { editDisabled ? 'EDIT' : 'CANCEL' }
        </button>
        <button className="btn btn-danger contact-btn" onClick={(e) => {
          e.preventDefault();
          deleteContact(contact.id);
        }}>
          DELETE
        </button>
      </div>
    )
  }
};

export default ContactView;
