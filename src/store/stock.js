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
    const response = await csrfFetch(`/api/stock/${id}`)
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
            // return {
            //     ...state,
            //     ...action.payload
            // }
            newState = Object.assign({}, state);
            newState.stock = [...action.payload];
            newState.mark = stockList


            return newState
        case PURCHASE_STOCK:
            console.log('what-----------------------------------',action)
            if (action.payload.response.response.type === "purchase") {
                newState = Object.assign({}, ...state.stock);
                newState.stock = [...state.stock, action.payload.response]
                return newState
            } else {

                state.mark[action.payload.response.response.id] = action.payload.response.response

                // console.log(Object.entries(state.mark))
                let temp = []

                for (const [key, val] of Object.entries(state.mark)){
                    temp.push(val)
                }
                // temp[action.payload.response.response.id] = action.payload.response.response
                newState = Object.assign({});
                
                console.log('==================================ss',state.mark)
                // newState.stock = [...state.stock, action.payload.response]
                newState.stock = [...temp];
                newState.mark = state.mark;
                return newState
                
                // return {
                //     ...state.stock,
                //     [action.payload.response.response.id]: action.payload.response.response,
                // }
            }
        // case UPDATE_STOCK:
        //     newState = Object.assign({});
        //     newState.stock = [...state.stock, action.payload.response]
        //     return newState
        default:
            return state
    }

} 


export default  stockReducer