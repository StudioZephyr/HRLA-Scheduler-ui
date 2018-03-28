import React from 'react';

const PostModal = (props) => {
  const {
    roomName,
    selectedStart,
    selectedEnd,
    handlePurposeChange,
    createEvent,
    resetEventsRow,
    room,
    selectedRoom,
    roomSelected,
    handleRoomSelect,
    colors
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
                {!room &&
                  <div className='btn-group'>

                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {selectedRoom.name}
                    </button>
                    <div className="dropdown-menu">
                      {props.rooms.map((room, i) => {
                        return <option style={{color:colors[i]}} onClick={()=>{handleRoomSelect(room)}}>{room.name}</option>
                      })}
                    </div>
                  </div>
                }
              </form>
            </div>

            <div className="modal-footer">
            {!room && !roomSelected ?
              <button type="button" className="btn btn-danger" >Submit</button>
            :

              <button type="button" className="btn btn-secondary" onClick={createEvent} data-dismiss="modal">Submit</button>
            }
              
            
              <button type="button" className="btn btn-secondary" onClick={resetEventsRow} data-dismiss="modal" >Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostModal;