import { csrfFetch } from "./csrf";

const LOAD = 'stock/load'
const PURCHASE_STOCK = 'stock/purchaseStock';
const UPDATE_STOCK = 'stock/updateStock';

const load = stocks => ({
    type: LOAD,
    payload: stocks
});

const purchaseStock = (stock) => {
    return {
        type: PURCHASE_STOCK,
        payload: stock,
    };
};

const updateStock = (stock) => {
    return {
        type: UPDATE_STOCK,
        payload: stock
    }
};

export const stocks = id => async dispatch => {
    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/stock/${id}`)
    const data = await response.json();

    dispatch(load(data.stocks))

    return response
}

export const purchase = (stock) => async dispatch => {

    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/stock`, {
        method: 'POST',
        body: JSON.stringify(stock)
    })
    
    const data = await response.json();

    dispatch(purchaseStock(data))
    return data

}

const initialState = { stock: [] };

const stockReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD:
            const stockList = {}
            action.payload.forEach(stock => {
                stockList[stock.id] = stock
            })
            newState = Object.assign({}, state);
            newState.stock = [...action.payload];
            newState.mark = stockList


            return newState
        case PURCHASE_STOCK:
            // if stock doesnt exist via backend, add new stock to list
            if (action.payload.response.response.type === "purchase") {
                newState = Object.assign({}, ...state.stock);
                newState.stock = [...state.stock, action.payload.response]
                return newState
            } else {
                // otherwise spread listed object values and replace the marked value, re-add to list
                state.mark[action.payload.response.response.id] = action.payload.response.response;

                let temp = [];

                for (const [key, val] of Object.entries(state.mark)){
                    temp.push(val)
                };
  
                newState = Object.assign({});
                newState.stock = [...temp];
                newState.mark = state.mark;
                
                return newState
            }
        default:
            return state
    }

} 


export default  stockReducer