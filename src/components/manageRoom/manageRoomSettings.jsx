import React, { Component } from 'react';
import axios from 'axios';

import Loading from '../loading/loadingView.jsx';

const API_SERVER = process.env.API_SERVER;

class ManageRoomsSettings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        room settings
      </div>
    )
  }
};

export default ManageRoomsSettings;
