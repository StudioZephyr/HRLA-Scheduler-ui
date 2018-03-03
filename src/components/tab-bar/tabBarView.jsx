import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TabBarView extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Link to="/account">User Settings</Link>
        <Link to="/account/contacts">Contacts</Link>
      </div>
    )
  }
}

export default TabBarView;
