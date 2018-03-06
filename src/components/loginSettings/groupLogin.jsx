import React, { Component } from 'react';

const GroupLoginSettings = (props) => (
  <form>
    <div className="form-group">
      <label htmlFor="group-login-groupName">Group Name</label>
      <input type="text" id="group-login-groupName" className="form-control" placeholder={props.groupName} onChange={(e) => {
        props.setGroupName(e.target.value);
      }} disabled={props.editDisabled} />
    </div>
  </form>
);

export default GroupLoginSettings;
