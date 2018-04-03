import React from 'react';
import './legend.css';

const Legend = (props) => {
  const { rooms, colors, filter } = props;

  return (
    <div className="legend-bar">
      <div className="legend-container"></div>
      <div className='legend'>
        {
          rooms.map((room, i) => {
            return <button className="btn btn-secondary" style={{ backgroundColor: colors[i] }} onClick={() => { filter(i) }}>{room.name}</button>
          })
        }

        <button className="btn btn-secondary" onClick={() => { filter(null) }}>All rooms</button>
      </div>
      <div className="legend-container"></div>
    </div>
  )

}

export default Legend;