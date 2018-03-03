import React, { Component } from 'react';

class GroupAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: '',
      editDisabled: true,
    }
  }

  setGroupName(text) {
    this.setState({
      groupName: text,
    });
  }

  toggleEdit() {
    this.setState({
      editDisabled: !this.state.editDisabled,
    });
  }

  render() {
    const { updateLogin, user } = this.props;
    const { groupName, editDisabled } = this.state;

    return (
      <div>
        <form>
          <input type="text" placeholder={user.groupName} disabled={editDisabled} onChange={(e) => {
            this.setGroupName(e.target.value);
          }} />
          {
            !editDisabled && 
            <button onClick={(e) => {
              e.preventDefault();
              updateLogin({ groupName }, user.id);
            }} >
              SUBMIT
            </button>
          }
          <button onClick={(e) => {
            e.preventDefault();
            this.toggleEdit();
          }} >
            {
              editDisabled ? 'EDIT' : 'CANCEL'
            }
          </button>
        </form>
      </div>
    )
  }
};

export default GroupAccount;
