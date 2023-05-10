import { csrfFetch } from "./csrf";

const LOAD = 'stock/load'

const load = stocks => ({
    type: LOAD,
    payload: stocks
});

export const stocks = id => async dispatch => {
    const response = await csrfFetch(`/api/stock/${id}`)
    const data = await response.json();

    dispatch(load(data.stocks))

    return response
}

const initialState = { stock: [] };

const stockReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD:
            newState = Object.assign({}, state);
            newState.stock = [...action.payload];
            return newState
        default:
            return state
    }

} 


export default  stockReducer