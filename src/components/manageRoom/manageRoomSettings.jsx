import React, { Component } from 'react';
import axios from 'axios';

import Loading from '../loading/loadingView.jsx';
import AddRoomView from './addRoomView.jsx';
import ManageRoomView from './manageRoomView.jsx';

const API_SERVER = process.env.API_SERVER;

class ManageRoomsSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
      rooms: [],
    };

    this.addRoom = this.addRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
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

  addRoom(roomObj) {
    axios.post(`${API_SERVER}/api/room`, roomObj)
      .then(({ data }) => {
        alert(`Room, ${roomObj.name}, has been added!`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      })
      .catch((err) => {
        console.log(`Error creating room. ${err.message}`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      });
  }

  deleteRoom(id, name) {
    axios.delete(`${API_SERVER}/api/room/${id}`)
      .then(() => {
        alert(`Room, ${name}, has been deleted!`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      })
      .catch(err => {
        console.log(`Error deleting room. ${err.message}`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      });
  }

  updateRoom(roomObj, id) {
    axios.put(`${API_SERVER}/api/room/${id}`, roomObj)
      .then(() => {
        alert(`Room has been updated to: ${roomObj.name}!`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      })
      .catch(err => {
        console.log(`Error updating room. ${err.message}`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      });
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
        <AddRoomView addRoom={this.addRoom} />
        <div className="row justify-content-center">
          {
            rooms.map((room, i) => (
              <ManageRoomView key={`manage-room-${i}`} room={room} deleteRoom={this.deleteRoom} updateRoom={this.updateRoom} />
            ))
          }
        </div>
      </div>
    )
  }
};

export default ManageRoomsSettings;
