import React, { Component } from 'react';

class ManageGroupView extends Component {
  constructor(props) {
    super(props);

    const { login, password, groupName } = this.props.login;

    this.state = {
      editDisabled: true,
      login,
      password,
      groupName,
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

  toggleEdit() {
    this.setState({
      editDisabled: !this.state.editDisabled,
    });
  }

  render() {
    const { editDisabled, groupName, login, password } = this.state;
    const { deleteLogin, updateLogin } = this.props;
    const { id } = this.props.login;

    return (
      <div className="col col-lg-auto col-edit-group">
        <form>
          <div className="form-group">
            <label htmlFor="manage-group-login">Login</label>
            <input type="text" id="manage-group-login" className="form-control" disabled={editDisabled} placeholder={login} onChange={(e) => {
              this.setLogin(e.target.value);
            }} />
          </div>
          <div className="form-group">
            <label htmlFor="manage-group-pw">Password</label>
            <input type="text" id="manage-group-pw" className="form-control" disabled={editDisabled} placeholder={password} onChange={(e) => {
              this.setPassword(e.target.value);
            }} />
          </div>
          <div className="form-group">
            <label htmlFor="manage-group-groupName">Group Name</label>
            <input type="text" id="manage-group-groupName" className="form-control" disabled={editDisabled} placeholder={groupName} onChange={(e) => {
              this.setGroupName(e.target.value);
            }} />
          </div>
        </form>
          {
            !editDisabled &&
            <button className="btn btn-success contact-btn" onClick={(e) => {
              e.preventDefault();
              updateLogin({ login, password, groupName }, id);
            }}>
              SUBMIT
            </button>
          }
        <button className="btn btn-primary contact-btn" onClick={(e) => {
          e.preventDefault();
          this.toggleEdit();
        }}>
          { editDisabled ? 'EDIT' : 'CANCEL' }
        </button>
        <button className="btn btn-danger contact-btn" onClick={(e) => {
          e.preventDefault();
          deleteLogin(id);
        }}>
          DELETE
        </button>
      </div>
    )
  }
}

export default ManageGroupView;
