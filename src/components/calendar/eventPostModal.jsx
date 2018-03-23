import React from 'react';

const PostModal = (props) => {
  const {
    roomName,
    selectedStart,
    selectedEnd,
    handlePurposeChange,
    createEvent,
    resetEventsRow,
    room
  } = props;

  return (
    <div>
    <div className="modal fade" id={`${roomName}Modal`} role='dialog' tabIndex="-1">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{room}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{`${selectedStart.format('hh:mm a')} - ${selectedEnd.format('hh:mm a')}`}</p>
            <form>
              Description:<br />
              <input id='eventNameInput' type='text' onChange={handlePurposeChange.bind(this)} />
            </form>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={createEvent} data-dismiss="modal">Submit</button>
              <button type="button" className="btn btn-secondary" onClick={resetEventsRow} data-dismiss="modal" >Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default PostModal;