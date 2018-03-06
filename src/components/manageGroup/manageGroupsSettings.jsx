import React, { Component } from 'react';
import axios from 'axios';

import './manageGroupSettings.css';

import ManageGroupView from './manageGroupView.jsx';
import AddGroupView from './addGroupView.jsx';
import Loading from '../loading/loadingView.jsx';

const API_SERVER = process.env.API_SERVER;

class ManageGroupsSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
      logins: [],
    };

    this.addLogin = this.addLogin.bind(this);
    this.updateLogin = this.updateLogin.bind(this);
    this.deleteLogin = this.deleteLogin.bind(this);
  }

  componentDidMount() {
    const { updated } = this.state;

    if (!updated) {
      axios.get(`${API_SERVER}/api/login`)
        .then(({ data }) => {
          const loginsArr = data.result.sort((a, b) => {
            return a.id - b.id;
          });

          this.setState({
            logins: loginsArr,
            updated: true,
          });
        })
        .catch(err => {
          console.log(`Error getting all Logins. ${err.message}`);
          this.setState({
            updated: true,
          });
        });
    }
  }

  addLogin(loginObj) {
    axios.post(`${API_SERVER}/api/signup`, loginObj)
      .then(({ data }) => {
        alert(`User, ${data.result.login}, has been added!`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      })
      .catch(err => {
        console.log(`Error adding User. ${err.message}`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      });
  }
  
  deleteLogin(id) {
    axios.delete(`${API_SERVER}/api/login/${id}`)
      .then(() => {
        alert(`User has been deleted!`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      })
      .catch(err => {
        console.log(`Error deleting Login. ${err.message}`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      });
  };

  updateLogin(loginObj, id) {
    axios.put(`${API_SERVER}/api/login/${id}`, loginObj)
      .then(({ data }) => {
        alert(`User, ${data.result.login}, has been updated!`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      })
      .catch(err => {
        console.log(`Error updating User. ${err.message}`);
        this.setState({
          updated: false,
        });
        this.componentDidMount();
      });
  }

  render() {
    const { add, updated, logins } = this.state;

    if (!updated) {
      return (
        <Loading />
      )
    }

    return (
      <div className="account-settings">
        <AddGroupView addLogin={this.addLogin} />
        <div className="row justify-content-center ">
          {
            logins.map((login, i) => (
              <ManageGroupView key={`manage-group-${i}`} login={login} deleteLogin={this.deleteLogin} updateLogin={this.updateLogin} />
            ))
          }
        </div>
      </div>
    )
  }
};

export default ManageGroupsSettings;
