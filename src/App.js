import {useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

import * as sessionActions from './store/session'
import { wallets } from './store/wallet';

import NavBar from './components/navBar';
import Ticker from './pages/Ticker';
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainRoutes from './components/mainRoutes';
import { stocks } from './store/stock';
import NavBarMobile from './components/navBar-mobile';
import { original, complete, currentPrice  } from './utils/info';
import { fetchMultipleTickers } from './store/multiple';
import { dayCounter } from './utils/info';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const stocksData = useSelector(state => state?.stock?.stock)

  const [ isLoaded, setLoaded ] = useState(false)
  const [ showMenu, setShowMenu ] = useState(false);
  
  const [list, setList] = useState([]);
  const [orig, setOrigi] = useState({});
  const [once, setOnce] = useState(true)
  const [avg, setAvg] = useState(0)
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)

  const today = new Date();
  var dayBefore =  new Date(today.setDate(today.getDate()-2)).toISOString().split('T')[0]

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setLoaded(true))

  }, [dispatch])

  useEffect(() => {
    if (user?.id > 0) {
      dispatch(wallets(user?.id))
      dispatch(stocks(user?.id))  
    }
  }, [user?.id])

  useEffect(() => {
    run()
    .then((data) => original(data, stocksData, setOrigi, setAvg))
    .then((data) => complete(data, setList))
    .then(entries => currentPrice(entries, setCurrent, setTotal))
    .catch(err => console.log(err))
  }, [stocksData])

  async function run() {
    if (stocksData.length ) {
      const dataset = dispatch(fetchMultipleTickers({stocksData, dayBefore, dayCounter:dayCounter(1250, today)}))
        return dataset
    }
  }
  
  if (isLoaded === false) {
    <Navigate to="/login" />
  }

  return (

    <BrowserRouter>
  
      <Routes>
      <Route path='/' element={ <MainRoutes isLoaded={isLoaded} showMenu={showMenu} setShowMenu={setShowMenu} stocksData={stocksData} total={total} current={current} list={list} /> } />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />  
        <Route  path='/ticker/:ticker' element={ <><NavBar /> <Ticker /> <NavBarMobile /> </> } />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
