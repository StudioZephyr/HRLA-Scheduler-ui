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

  render() {
    const { addLogin } = this.props;

    return (
      <div>
        HELLO ADDING
      </div>
    )
  }
};

export default AddGroupView;
