import React, { Component } from 'react';

class AddRoomView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
    };
  }

  setName(text) {
    this.setState({
      name: text,
    });
  }

  render() {
    const { addRoom } = this.props;
    const { name } = this.state;

    return (
      <div>
        <div className="row justify-content-center manage-add-row">
          <h2>Manage Rooms</h2>
          <button className="btn btn-info manage-add-btn" data-toggle="modal" data-target="#add-room-modal">
            ADD
          </button>
        </div>
        <div className="modal bd-example-modal-lg" id="add-room-modal" tabIndex="-1" role="dialog" aria-labelledby="add-room-label" aria-hidden="true">
          <div className="modal-dialong manage-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="add-room-label">Add Room</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="add-room_name">Name</label>
                    <input type="text" id="add-room_name" className="form-control" placeholder={'Room Name'} onChange={(e) => {
                      this.setName(e.target.value);
                    }} />
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
                    addRoom({ name });
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

export default AddRoomView;
