import { csrfFetch } from "./csrf";

const SET_MULTIPLE = 'multiple/setMultiple';

const setMultiple = (multiple) => {
    return {
        type: SET_MULTIPLE,
        payload: multiple
    }
};

export const fetchMultipleTickers = ({stocks, dayBefore, dayCounter}) => async (dispatch) => {
    let response
    try{
        response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/ticker/search/multiple`, {
            method: 'POST',
            body: JSON.stringify({
                symbols: stocks?.map(stock => stock?.ticker),
                to: dayBefore,
                from: dayCounter(350),
            })
        })
    } catch(err) {
        console.log(err)
    }
    const data = await response.json()
 
    dispatch(setMultiple(data))

    return data
};

const initialState = { multiple: null };

const multipleReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case SET_MULTIPLE:
            newState = Object.assign({}, state);
            newState.multiple = action.payload;
            return newState
        default:
            return state;
    };
}

export default multipleReducer;