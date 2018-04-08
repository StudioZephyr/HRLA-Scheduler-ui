import axios from 'axios';

const API_SERVER = process.env.API_SERVER;

const getContacts = (id) => (dispatch) => {
  axios.get(`${API_SERVER}/api/contact/${id}`)
    .then(({ data }) => {
      dispatch({ type: 'CONTACTS_GET_SUCCESS', payload: data.result });
    })
    .catch(err => {
      console.log(`Error getting Contacts. ${err.message}`);
      dispatch({ type: 'CONTACTS_GET_FAILED' });
    });
};

const addContact = (contactObj, id) => (dispatch) => {
  axios.post(`${API_SERVER}/api/contact/${id}`, contactObj)
    .then(({ data }) => {
      dispatch({ type: 'CONTACT_SUCCESS' });
    })
    .catch(err => {
      console.log(`Error adding Contact. ${err.message}`);
      dispatch({ type: 'CONTACT_FAILED' });
    });
};

const updateContact = (contactObj, id) => (dispatch) => {
  axios.put(`${API_SERVER}/api/contact/${id}`, contactObj)
    .then(({ data }) => {
      dispatch({ type: 'CONTACT_SUCCESS' });
    })
    .catch(err => {
      console.log(`Error updating contact. ${err.message}`);
      dispatch({ type: 'CONTACT_FAILED' });
    });
};

const deleteContact = (id) => (dispatch) => {
  axios.delete(`${API_SERVER}/api/contact/${id}`)
    .then(({ data }) => {
      dispatch({ type: 'CONTACT_SUCCESS' });
    })
    .catch(err => {
      console.log(`Error deleting contact. ${err.message}`);
      dispatch({ type: 'CONTACT_FAILED' });
    });
};

const loadContacts = () => (dispatch) => {
  dispatch({ type: 'CONTACT_LOADED' })
}

export { getContacts, addContact, updateContact, deleteContact, loadContacts };
