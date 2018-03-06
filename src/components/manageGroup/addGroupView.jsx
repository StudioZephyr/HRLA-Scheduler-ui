import React, { Component } from 'react';

class AddGroupView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      add: false,
      login: '',
      password: '',
      groupName: '',
      type: '',
    };
  }

  setGroupName(text) {
    this.setState({
      groupName: text,
    });
  }

  setLogin(text) {
    this.setState({
      login: text,
    });
  }

  setPassword(text) {
    this.setState({
      password: text,
    });
  }

  setType(text) {
    this.setState({
      type: text,
    });
  }

  toggleAdd() {
    this.setState({
      add: !this.state.add,
    });
  }

  render() {
    const { addLogin } = this.props;
    const { add, login, password, groupName, type } = this.state;

    return (
      <div className="row justify-content-center manage-add-row">
        <div className="col col-lg-auto">
          {
            add &&
            <form>
              <div className="form-row">
                <div className="form-group manage-add-form">
                  <label htmlFor="manage-add-login">Login</label>
                  <input type="text" id="manage-add-login" className="form-control" placeholder={'Login'} onChange={(e) => {
                    this.setLogin(e.target.value);
                  }} />
                </div>
                <div className="form-group manage-add-form">
                  <label htmlFor="manage-add-pw">Password</label>
                  <input type="text" id="manage-add-pw" className="form-control" placeholder={'Password'} onChange={(e) => {
                    this.setPassword(e.target.value);
                  }} />
                </div>
                <div className="form-group manage-add-form">
                  <label htmlFor="manage-add-groupName">Group Name</label>
                  <input type="text" id="manage-add-groupName" className="form-control" placeholder={'Group Name'} onChange={(e) => {
                    this.setGroupName(e.target.value);
                  }} />
                </div>
                <div className="form-group manage-add-form">
                  <label htmlFor="manage-add-type">Type</label>
                  <select id="manage-add-type" className="form-control" onChange={(e) => {
                    this.setType(e.target.value);
                  }} >
                    <option value="" disabled selected>Choose...</option>
                    <option value="admin">Admin</option>
                    <option value="group">Group</option>
                  </select>
                </div>
              </div>
            </form>
          }
        </div>
        <div className="col col-lg-auto align-self-end">
          {
            add &&
            <button className="btn btn-success contact-add-btn" onClick={(e) => {
              e.preventDefault();
              addLogin({ login, password, groupName, type });
            }} >
              SUBMIT
            </button>
          }
          <button className="btn btn-info contact-add-btn" onClick={(e) => {
            e.preventDefault();
            this.toggleAdd();
          }} >
            { add ? 'CANCEL' : 'ADD' }
          </button>
        </div>
      </div>
    )
  }
};

export default AddGroupView;
