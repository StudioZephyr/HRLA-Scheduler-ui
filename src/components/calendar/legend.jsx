import React from 'react';

const Legend = (props) => {
  const { rooms, colors, filter } = props;

  return (
    <div className='legend'>
      {
        rooms.map((room, i) => {
          return <button style={{backgroundColor: colors[i]}} onClick={()=> {filter(i)}}>{room.name}</button>
        })
        }

        <button onClick={()=> {filter(null)}}>All rooms</button>
    </div>
  )

}

export default Legend;