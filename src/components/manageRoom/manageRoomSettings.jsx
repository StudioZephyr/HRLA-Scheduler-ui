import React, { Component } from 'react';
import axios from 'axios';

import Loading from '../loading/loadingView.jsx';

const API_SERVER = process.env.API_SERVER;

class ManageRoomsSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
      rooms: [],
    };
  }

  componentDidMount() {
    const { updated } = this.state;

    if (!updated) {
      axios.get(`${API_SERVER}/api/rooms`)
        .then(({ data }) => {
          this.setState({
            rooms: data.result,
            updated: true,
          });
        })
        .catch(err => {
          console.log(`Error getting Rooms. ${err.message}`);
          alert(`There was an issue retrieving room information. Please refresh the page.`);
          this.setState({
            updated: true,
          });
        });
    }
  }

  render() {
    const { updated, rooms } = this.state;

    if (!updated) {
      return (
        <Loading />
      )
    }

    return (
      <div className="account-settings">
        room settings
      </div>
    )
  }
};

export default ManageRoomsSettings;
