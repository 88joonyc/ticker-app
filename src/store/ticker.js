import { csrfFetch } from "./csrf";

const ADD_TICKER = 'ticker/addTicker';

const addTicker = (ticker) => {
    return {
        type: ADD_TICKER,
        payload: ticker
    }
};

const headerOptions = {
    method: 'GET',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${process.env.REACT_APP_POLYGONAPISECRETEKEY}`
    }
}

export const findMyData = (payload, ticker) => async dispatch => {
    let data
    let metadata
    let news
   
    await Promise.all([
        csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/ticker/search`, {
            method:"POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(payload)
        }).then(async res => setData(await res.json()))
            .catch(err => console.log(err)),
        csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/ticker/details/${ticker}`)
        .then(async res => await res.json())
        .then(async returndata => {
            setMeta(returndata);
            const imageData = returndata?.results?.branding?.logo_url;
            if (imageData) {
                return fetch(imageData, headerOptions, {
                }).then(async res => setImage(await res.text())).catch(err => console.log(err))
                
            }
        })
        .catch(err => console.log(err)),
        csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/ticker/news/${ticker}`)
        .then(async res => await res.json())
        .then(data => setNews(data))
        .catch(err => console.log(err))
    ]); 

    const senddata = {"ticker":data.ticker, data, metadata, news}

    dispatch(addTicker(senddata))

    return senddata
} 

const initialState = {  };

const tickerReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case ADD_TICKER:
            newState = Object.assign({}, state);
            newState[action.payload.ticker] = {...action.payload};
            return newState
        default:
            return state;
    };
}

export default tickerReducer;