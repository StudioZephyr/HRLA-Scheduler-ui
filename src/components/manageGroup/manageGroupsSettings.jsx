import React, { Component } from 'react';
import axios from 'axios';

import ManageGroupView from './manageGroupView.jsx';
import AddGroupView from './manageGroupView.jsx';

class ManageGroupsSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updated: false,
      logins: [],
    };

    this.addLogin = this.addLogin.bind(this);
    this.updateLogin = this.updateLogin.bind(this);
  }

  componentDidMount() {
    const { updated } = this.state;

    if (!updated) {
      axios.get(`${process.env.API_SERVER}/api/login`)
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
    axios.post(`${process.env.API_SERVER}/api/signup`, loginObj)
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

  updateLogin(loginObj, id) {
    axios.put(`${process.env.API_SERVER}/api/login/${id}`, loginObj)
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
        <div>
          Updating..
        </div>
      )
    }

    if (logins.length === 0) {
      return (
        <div>
          Error getting logins. SOMETHING IS WRONG! AHHHHHHHHHHHHHHH
        </div>
      )
    }

    return (
      <div>
        {
          logins.map((login, i) => (
            <ManageGroupView key={`manage-group-${i}`} login={login} updateLogin={this.updateLogin} />
          ))
        }
        <AddGroupView addLogin={this.addLogin} />
      </div>
    )
  }
};

export default ManageGroupsSettings;
