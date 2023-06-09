import { csrfFetch } from './csrf';
import Cookies from 'js-cookie';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;      
  const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/session`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      credential,
      password,
    }),
    credentials: "include"
  });
  const data = await response.json();   

  dispatch(setUser(data.user));
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/session`, {
      method: 'GET', credentials: 'include'
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const signup = (user) => async (dispatch) => {
    const { fullName, email, password } = user;
    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/users`, {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const logout = () => async (dispatch) => {
    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/session`, {
      method: 'DELETE',
      credentials: "include"
    });
    dispatch(removeUser());

    return response;
  };

export default sessionReducer;
