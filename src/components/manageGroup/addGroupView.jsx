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
      <div>
        {
          add &&
          <form>
            <input type="text" placeholder={'Login'} onChange={(e) => {
              this.setLogin(e.target.value);
            }} />
            <input type="text" placeholder={'Password'} onChange={(e) => {
              this.setPassword(e.target.value);
            }} />
            <input type="text" placeholder={'Group Name'} onChange={(e) => {
              this.setGroupName(e.target.value);
            }} />
            <select onChange={(e) => {
              this.setType(e.target.value);
            }} >
              <option value="" disabled selected>Choose Type</option>
              <option value="admin">Admin</option>
              <option value="group">Group</option>
            </select>
            <button onClick={(e) => {
              e.preventDefault();
              addLogin({ login, password, groupName, type });
            }} >
              SUBMIT
            </button>
          </form>
        }
        <button onClick={(e) => {
          e.preventDefault();
          this.toggleAdd();
        }} >
          { add ? 'CANCEL' : 'ADD' }
        </button>
      </div>
    )
  }
};

export default AddGroupView;
