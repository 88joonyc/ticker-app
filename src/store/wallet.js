import { csrfFetch } from './csrf';

const LOAD = 'wallet/load'
const CREATE_WALLET = 'wallet/createWallet';
const UPDATE_WALLET = 'wallet/updateWallet';

const load = (wallets) => {
    return {
        type: LOAD,
        payload: wallets
    }
};

const createWallet = (wallet) => {
    return {
        type: CREATE_WALLET,
        payload: wallet,
    };
};

const updateWallet = (wallet) => {
    return {
        type: UPDATE_WALLET,
        payload: wallet
    }
};

export const wallets = (id) => async (dispatch) => {
    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/wallet/${id}`)

    
    const data = await response.json();
    dispatch(load(data.wallets))
    
    return response
};
 
export const create = (wallet) => async (dispatch) => {
    const { amount, userId, accountType } = wallet;

    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/wallet`, {
        method: 'POST',
        body: JSON.stringify({
            amount,
            userId,
            accountType,
        }),
    });
    const data = await response.json();
    dispatch(createWallet(data.wallet));
    return response;

};

export const update = (wallet) => async (dispatch) => {
    const { userId, accountType, amount } = wallet;

    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/wallet`, {
        method: 'POST',
        body: JSON.stringify({
            amount,
            userId,
            accountType,
        }),
    });

    const data = await response.json();
    dispatch(updateWallet(data.wallet));
    
    return data

};

export const directUpdate = (wallet) => async (dispatch) => {
    const { userId, accountType, amount } = wallet;

    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/wallet/update`, {
        method: 'POST',
        body: JSON.stringify({
            amount,
            userId,
            accountType,
        }),
    });

    const data = await response.json();
    dispatch(updateWallet(data.wallet));
    
    return data

};

const initialState = { wallet: [] };

const walletReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD: 
            const walletList = {}
            action.payload.forEach(wallet => {
                walletList[wallet.id] = wallet;
            });
            newState = Object.assign({}, state);
            newState.wallet = [...action.payload];
            newState.mark = walletList
            return newState;
        case CREATE_WALLET:
            newState = Object.assign({}, state);
            newState.wallet = [...state.wallet, action.payload];
            return newState;
        case UPDATE_WALLET:
            if (action.payload.id) {
                state.mark[action.payload.id] = action.payload
                let temp = []
                for (const [key, val] of Object.entries(state.mark)) {
                    temp.push(val);
                };
                newState = Object.assign({})
                newState.wallet = [...temp]
                newState.mark = state.mark
                return newState
            }
        default:
            return state
    }
}

export default walletReducer;