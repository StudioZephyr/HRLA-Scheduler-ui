import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

import './tabBarView.css';

class TabBarView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized } = this.props;
    return (
      <nav className="nav flex-column nav-pills" id="tabnav">
        <NavLink exact className="nav-link"
          to={{
            pathname: "/account",
            state: { authorized }
          }}
        >
          User Settings
        </NavLink>
        <NavLink className="nav-link"
          to={{
            pathname: "/account/contacts",
            state: { authorized }
          }}
        >
          Contacts
        </NavLink>
        <NavLink className="nav-link"
          to={{
            pathname: "/account/manage",
            state: { authorized }
          }}
        >
          Manage
        </NavLink>
      </nav>
    )
  }
}

export default TabBarView;
