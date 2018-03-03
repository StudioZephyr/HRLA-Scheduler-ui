import axios from 'axios';

const API_SERVER = process.env.API_SERVER;

const getContacts = (id) => (dispatch) => {
  axios.get(`${API_SERVER}/api/contact/${id}`)
    .then(({ data }) => {
      console.log(`DATA FROM GET CONTACTS: ${data}`);
      dispatch({ type: 'CONTACTS_GET_SUCCESS', payload: data.result });
    })
    .catch(err => {
      console.log(`Error getting Contacts. ${err.message}`);
      dispatch({ type: 'CONTACTS_GET_FAILED' });
    });
};

export { getContacts };
