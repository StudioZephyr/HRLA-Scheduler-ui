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
      editDisabled: this.state.editDisabled,
    });
  }

  render() {
    const { editDisabled, email, name } = this.state;

    return (
      <div>
        <ContactInfo editDisabled={editDisabled} name={name} email={email}
          setEmail={this.setEmail}
          setName={this.setName}
        />
        {
          !editDisabled &&
          <button onClick={(e) => {
            e.preventDefault();
          }} >
            SUBMIT
          </button>
        }
        <button onClick={(e) => {
          e.preventDefault();
          this.toggleEdit();
        }} >
          { editDisabled ? 'EDIT' : 'CANCEL' }
        </button>
      </div>
    )
  }
};

export default ContactView;
