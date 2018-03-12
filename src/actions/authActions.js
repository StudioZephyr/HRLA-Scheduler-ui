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

const authLogout = () => (dispatch) => {
  dispatch({ type: `LOGOUT_SUCCESS` });
  dispatch(push('/'));
};

const updateLogin = (userObj, id) => (dispatch) => {
  axios.put(`${API_SERVER}/api/login/${id}`, userObj)
    .then(({ data }) => {
      dispatch({ type: 'UPDATE_SUCCESS', payload: data.result });
    })
    .catch(err => {
      console.log(`Error updating User. ${err.message}`);
      dispatch({ type: 'UPDATE_FAILED' });
    });
};

const refreshUser = (id) => (dispatch) => {
  axios.get(`${API_SERVER}/api/login/${id}`)
  .then(({ data }) => {
    console.log('attempting to refresh user with', data.result)
    dispatch({ type: 'USER_RETRIEVED', payload: data.result });
  })
  .catch(err => {
    console.log(`Error Retrieving User Info. ${err.message}`);
    dispatch({type: `USER_RETRIEVAL_FAILED`});
  })
}

export { authLogin, authLogout, updateLogin, refreshUser };
