import React from 'react';

export const AdminLoginSettings = (props) => (
  <form>
    <input type="text" placeholder={props.groupName} disabled={props.editDisabled} onChange={(e) => {
      props.setGroupName(e.target.value);
    }} />
  </form>
);
