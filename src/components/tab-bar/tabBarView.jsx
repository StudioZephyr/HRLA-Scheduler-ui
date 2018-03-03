import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TabBarView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <Link to={{
          pathname: "/account",
          state: { user }
        }}>User Settings</Link>
        <Link to={{
          pathname: "/account/contacts",
          state: { id: user.id }
        }}>Contacts</Link>
      </div>
    )
  }
}

export default TabBarView;
