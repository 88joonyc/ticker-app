import { csrfFetch } from "./csrf";

const LOAD = 'stock/load'

const load = stocks => ({
    type: LOAD,
    payload: stocks
});

export const stocks = id => async dispatch => {
    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/stock/${id}`)
    const data = await response.json();

    dispatch(load(data.stocks))

    return response
}


export const purchase = (stock) => async dispatch => {

    const response = await csrfFetch(`/api/stock`, {
        method: 'POST',
        body: JSON.stringify(stock)
    })

    
    const data = await response.json();
    console.log('hi-----------------------',data)

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
            // if this is a new purchase, add the new item to the end 
            if (action.payload.response.response.type === "purchase") {
                newState = Object.assign({}, ...state.stock);
                newState.stock = [...state.stock, action.payload.response]
                return newState
            } else {
                // othewise we need to update the proper item 
                state.mark[action.payload.response.response.id] = action.payload.response.response
                let temp = []
                for (const [key, val] of Object.entries(state.mark)){
                    temp.push(val)
                }
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