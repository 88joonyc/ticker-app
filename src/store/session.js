import { csrfFetch } from './csrf';

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

const url = 'https://ticker-app-api-production.up.railway.app'

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;      
  const response = await csrfFetch(`${url}/api/session`, {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    })
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
    const response = await csrfFetch(`${url}/api/session`);
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export const signup = (user) => async (dispatch) => {
    const { fullName, email, password } = user;
    const response = await csrfFetch(`${url}/api/users`, {
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
    const response = await csrfFetch(`${url}/api/session`, {
      method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
  };

export default sessionReducer;
