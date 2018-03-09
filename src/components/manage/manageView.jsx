import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import ManageRoutes from './routes.jsx';
import ManageNav from './manageNav.jsx';

class ManageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorized, type } = this.props.location.state;
    
    if (!authorized || type !== 'admin') {
      return (
        <Redirect to="/" />
      )
    }

    return (
      <div>
        <ManageNav authorized={authorized} type={type} />
        <ManageRoutes />
      </div>
    )
  }
};

export default withRouter(ManageView);
