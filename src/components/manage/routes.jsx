import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ManageGroup from '../manageGroup/manageGroupsSettings.jsx';
import ManageRoom from '../manageRoom/manageRoomSettings.jsx';

class ManageRoutes extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/account/manage" component={ManageGroup} />
        <Route path="/account/manage/room" component={ManageRoom} />
      </Switch>
    )
  }
};

export default ManageRoutes;
