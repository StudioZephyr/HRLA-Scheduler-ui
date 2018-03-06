import React, { Component } from 'react';

const AdminLoginSettings = ({ editDisabled, groupName, login, password, setGroupName, setLogin, setPassword }) => (
  <div className="login-settings-form">
    <form>
      <div className="form-group">
        <label htmlFor="admin-login-groupName">Group Name</label>
        <input type="text" id="admin-login-groupName" className="form-control" placeholder={groupName} disabled={editDisabled} onChange={(e) => {
          setGroupName(e.target.value);
        }} />
      </div>
      <div className="form-group">
        <label htmlFor="admin-login-login">Login</label>
        <input type="text" id="admin-login-login" className="form-control" placeholder={login} disabled={editDisabled} onChange={(e) => {
          setLogin(e.target.value);
        }} />
      </div>
      <div className="form-group">
        <label htmlFor="admin-login-pw">Password</label>
        <input type="text" id="admin-login-pw" className="form-control" placeholder={password} disabled={editDisabled} onChange={(e) => {
          setPassword(e.target.value);
        }} />
      </div>
    </form>
  </div>
);

export default AdminLoginSettings;
