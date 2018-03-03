import React, { Component } from 'react';

export const GroupLoginSettings = (props) => (
  <form>
    <input placeholder={props.groupName} onChange={(e) => {
      props.setGroupName(e.target.value);
    }} />
  </form>
);
