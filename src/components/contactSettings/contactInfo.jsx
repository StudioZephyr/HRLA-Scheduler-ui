import React, { Component } from 'react';

const ContactInfo = ({ editDisabled, email, name, setEmail, setName }) => (
  <form className="contact-form">
    <div className="form-group">
      <label htmlFor="contact-info-name">Name</label>
      <input type="text" id="contact-info-name" className="form-control" disabled={editDisabled} placeholder={name} onChange={(e) => {
        setName(e.target.value);
      }}
      />
    </div>
    <div className="form-group">
      <label htmlFor="contact-info-email">Email</label>
      <input type="text" id="contact-info-email" className="form-control" disabled={editDisabled} placeholder={email} onChange={(e) => {
        setEmail(e.target.value);
      }} />
    </div>
  </form>
);

export default ContactInfo;
