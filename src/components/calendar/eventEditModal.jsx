import React from 'react';

const EditModal = (props) => {
  const {
    start,
    end,
    desc,
    purpose,
    roomName,
    groupName,
    selectedEndAmPm,
    selectedStartAmPm,
    timeError,
    handlePurposeChange,
    handleEndAmPmChange,
    handleEndChange,
    handleStartAmPmChange,
    handleStartChange,
    formatTime,
    removeEvent,
    saveChanges,
    resetEventsRow
  } = props;

  return (
    <div>
      <div className="modal fade" id={`${roomName}EditModal`} role='dialog'>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Event</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h2>{desc}</h2>
              <form>
                Description:<br />
                <input id='eventNameInput' type='text' placeholder={purpose} onChange={handlePurposeChange} /> <br />
                Start:<br />
                <input id='eventStartInput' type='text' placeholder={formatTime(start)} onChange={handleStartChange} />
                <div className='btn-group'>
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {selectedStartAmPm}
                  </button>
                  <h8>hh:mm</h8>
                  {timeError ?
                    <p>-invalid time</p>
                    :
                    null
                  }
                  <div className="dropdown-menu">
                    <option onClick={handleStartAmPmChange} >am</option>
                    <option onClick={handleStartAmPmChange} >pm</option>
                  </div>
                </div>
                <br />
                End: <br />
                <input id='eventEndInput' type='text' placeholder={formatTime(end)} onChange={handleEndChange} />
                <div className='btn-group'>
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {selectedEndAmPm}
                  </button>
                  <h8>hh:mm</h8>
                  {timeError ?
                    <p>-invalid time</p>
                    :
                    <p></p>
                  }
                  <div className="dropdown-menu">
                    <option onClick={handleEndAmPmChange} >am</option>
                    <option onClick={handleEndAmPmChange} >pm</option>
                  </div>
                </div>
              </form>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={removeEvent} data-dismiss="modal">Delete event</button>
                {timeError ?
                  <button type="button" className="btn btn-danger">Save Changes</button>
                  :
                  <button type="button" className="btn btn-secondary" onClick={saveChanges} data-dismiss="modal">Save Changes</button>
                }

                <button type="button" className="btn btn-secondary close" onClick={resetEventsRow} data-dismiss="modal" >Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditModal;