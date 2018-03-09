import React, { Component } from 'react';

class ManageRoomView extends Component {
  constructor(props) {
    super(props);

    const { name } = this.props.room;

    this.state = {
      editDisabled: true,
      name,
    };
  }

  setName(text) {
    this.setState({
      name: text,
    });
  }

  toggleEdit() {
    this.setState({
      editDisabled: !this.state.editDisabled,
    });
  }

  render() {
    const { name, editDisabled } = this.state;
    const { deleteRoom, updateRoom } = this.props;
    const { id } = this.props.room;

    return (
      <div className="col col-lg-auto col-edit-group">
        <form>
          <div className="form-grou">
            <label htmlFor="manage-room_name">Room Name</label>
            <input type="text" id="manage-room_name" className="form-control" disabled={editDisabled} placeholder={name} onChange={(e) => {
              this.setName(e.target.value);
            }} />
          </div>
        </form>
        {
          !editDisabled &&
          <button className="btn btn-success contact-btn" onClick={(e) => {
            e.preventDefault();
            updateRoom({ name }, id);
          }} >
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
          deleteRoom(id, name);
        }} >
          DELETE
        </button>
      </div>
    )
  }
};

export default ManageRoomView;
