import axios from 'axios';
import { push } from 'react-router-redux';

const API_SERVER = process.env.API_SERVER;

const authLogin = (userObj) => (dispatch) => {
  axios.post(`${API_SERVER}/api/login`, userObj)
    .then(({ data }) => {
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.result });
    })
    .catch(err => {
      console.log(`Error Logging in. ${err.message}`);
      dispatch({ type: 'LOGIN_FAILED' });
    });
};

export { authLogin };
