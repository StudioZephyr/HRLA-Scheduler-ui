import React, { Component } from 'react';

const AdminLoginSettings = ({ editDisabled, groupName, login, setGroupName, setLogin }) => (
  <form>
    <input type="text" placeholder={groupName} disabled={editDisabled} onChange={(e) => {
      setGroupName(e.target.value);
    }} />
    <input type="text" placeholder={login} disabled={editDisabled} onChange={(e) => {
      setLogin(e.target.value);
    }} />
  </form>
);

export default AdminLoginSettings;
