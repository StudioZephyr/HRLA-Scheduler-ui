import React, { Component } from 'react';

class AddGroupView extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    const { addLogin } = this.props;
    const { login, password, groupName, type } = this.state;

    return (
      <div>
        <div className="row justify-content-center manage-add-row">
          <button className="btn btn-info contact-add-btn" data-toggle="modal" data-target="#add-manage-modal" >
            ADD
          </button>
        </div>
        <div className="modal bd-example-modal-lg" id="add-manage-modal" tabIndex="-1" role="dialog" aria-labelledby="add-manage-modal-label" aria-hidden="true">
          <div className="modal-dialong manage-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add-manage-modal-label">Add Login</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="manage-add-login">Login</label>
                    <input type="text" id="manage-add-login" className="form-control" placeholder={'Login'} onChange={(e) => {
                      this.setLogin(e.target.value);
                    }} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="manage-add-pw">Password</label>
                    <input type="text" id="manage-add-pw" className="form-control" placeholder={'Password'} onChange={(e) => {
                      this.setPassword(e.target.value);
                    }} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="manage-add-groupName">Group Name</label>
                    <input type="text" id="manage-add-groupName" className="form-control" placeholder={'Group Name'} onChange={(e) => {
                      this.setGroupName(e.target.value);
                    }} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="manage-add-type">Type</label>
                    <select id="manage-add-type" className="form-control" onChange={(e) => {
                      this.setType(e.target.value);
                    }} >
                      <option value="" disabled selected>Choose...</option>
                      <option value="admin">Admin</option>
                      <option value="group">Group</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                  CANCEL
                </button>
                <button className="btn btn-success" data-dismiss="modal"
                  onClick={(e) => {
                    e.preventDefault();
                    addLogin({ login, password, groupName, type });
                  }}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default AddGroupView;
