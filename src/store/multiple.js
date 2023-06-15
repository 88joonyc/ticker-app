import { csrfFetch } from "./csrf";

const SET_MULTIPLE = 'multiple/setMultiple';

const setMultiple = (multiple) => {
    return {
        type: SET_MULTIPLE,
        payload: multiple
    }
};

export const fetchMultipleTickers = ({stocksData, dayBefore, dayCounter}) => async (dispatch) => {
    let response
    try{
        response = await csrfFetch('/api/ticker/search/multiple', {
            method: 'POST',
            'Content-type': 'application/JSON',
            body: JSON.stringify({
                symbols: stocksData?.map(stock => stock?.ticker),
                to: dayBefore,
                from: dayCounter,
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