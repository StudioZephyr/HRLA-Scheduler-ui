const addEvent = (event, state) => {
  return state.events.update(event.roomNo, (val) => {
    return val.push(event);
  })
}

const updateEvent = (event, state) => {
  const deepList = state.events.get(event.roomNo);
  console.log('ROOOOOOOM NUMBER', event.roomNo)
  const idx = deepList.findIndex((i) => {
    return i.id === event.id;
  })
  return state.events.updateIn([event.roomNo, idx], (value) => {
    return value = event;
  })
}

const deleteEvent = (event, state) => {
  console.log('DELETING EVENT', event)
  const deepList = state.events.get(event.roomNo);
  const idx = deepList.findIndex((i)=> {
    return i.id === event.id;
  })
  return state.events.deleteIn([event.roomNo, idx]);
}

export { addEvent, updateEvent, deleteEvent };