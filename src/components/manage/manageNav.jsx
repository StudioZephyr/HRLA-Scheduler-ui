import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class ManageNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized, type } = this.props;

    return (
      <nav className="nav nav-tabs" id="manageNav">
        <NavLink exact className="nav-link"
          to={{
            pathname: "/account/manage",
            state: { authorized, type }
          }}
        >
          Groups
        </NavLink>
        <NavLink className="nav-link"
          to={{
            pathname: "/account/manage/room",
            state: { authorized, type }
          }}
        >
          Rooms
        </NavLink>
      </nav>
    )
  }
};

export default ManageNav;
