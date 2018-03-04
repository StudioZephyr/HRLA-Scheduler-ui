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
    const { updateLogin } = this.props;
    const { id } = this.props.login;

    return (
      <div>
        <form>
          <input type="text" disabled={editDisabled} placeholder={login} onChange={(e) => {
            this.setLogin(e.target.value);
          }} />
          <input type="text" disabled={editDisabled} placeholder={password} onChange={(e) => {
            this.setPassword(e.target.value);
          }} />
          <input type="text" disabled={editDisabled} placeholder={groupName} onChange={(e) => {
            this.setGroupName(e.target.value);
          }} />
          {
            !editDisabled &&
            <button onClick={(e) => {
              e.preventDefault();
              updateLogin({ login, password, groupName }, id);
            }}>
              SUBMIT
            </button>
          }
        </form>
        <button onClick={(e) => {
          e.preventDefault();
          this.toggleEdit();
        }}>
          { editDisabled ? 'EDIT' : 'CANCEL' }
        </button>
      </div>
    )
  }
}

export default ManageGroupView;
