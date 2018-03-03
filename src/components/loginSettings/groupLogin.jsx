import React from 'react';

export const GroupLoginSettings = (props) => (
  <form>
    <input type="text" placeholder={props.groupName} onChange={(e) => {
      props.setGroupName(e.target.value);
    }} disabled={props.editDisabled} />
  </form>
);
