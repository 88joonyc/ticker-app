import react, {useState, useSelector, useEffect} from 'react';
import { BrowserRouter, Route, Switch, Routes, Navigate, useLocation  } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import * as sessionActions from './store/session'
import { wallets } from './store/wallet';

import TickerForm from './components/tickerForm';
import NavBar from './components/navBar';
import Ticker from './pages/Ticker';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainRoutes from './components/mainRoutes';
import { stocks } from './store/stock';

function App() {
  const dispatch = useDispatch();
  const [ isLoaded, setLoaded ] = useState(false)
  // const location = useLocation();


  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setLoaded(true))
    dispatch(wallets(1))
    dispatch(stocks(1))
  }, [dispatch])

  if (isLoaded === false) {
    <Navigate to="/login" />
  }
    

  

  return (

    <BrowserRouter>
  
      <Routes>
        
        <Route path='/' element={ <MainRoutes /> } />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />  
        {/* <Route  path='/' element={<> <Home /></>} /> */}
        <Route  path='/ticker/:ticker' element={ <><NavBar /> <Ticker /> </> } />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
