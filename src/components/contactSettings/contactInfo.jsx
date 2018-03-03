import React, { Component } from 'react';

const ContactInfo = ({ editDisabled, email, name, setEmail, setName }) => (
  <form>
    <input type="text" disabled={editDisabled} placeholder={name} onChange={(e) => {
      setName(e.target.value);
    }}
    />
    <input type="text" disabled={editDisabled} placeholder={email} onChange={(e) => {
      setEmail(e.target.value);
    }} />
  </form>
);

export default ContactInfo;
