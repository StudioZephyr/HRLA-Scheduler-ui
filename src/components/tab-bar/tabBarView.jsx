import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TabBarView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized } = this.props;
    return (
      <div>
        <Link to={{
          pathname: "/account",
          state: { authorized }
        }}>User Settings</Link>
        <Link to={{
          pathname: "/account/contacts",
          state: { authorized }
        }}>Contacts</Link>
        <Link to={{
          pathname: "/account/manage",
          state: { authorized }
        }}>Manage</Link>
      </div>
    )
  }
}

export default TabBarView;
