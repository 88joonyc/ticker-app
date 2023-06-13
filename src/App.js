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

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)

  const [ isLoaded, setLoaded ] = useState(false)


  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setLoaded(true))

  }, [dispatch])

  useEffect(() => {
    if (user?.id > 0) {
      dispatch(wallets(user?.id))
      dispatch(stocks(user?.id))  
    }
  }, [user?.id])
  
  if (isLoaded === false) {
    <Navigate to="/login" />
  }

  return (

    <BrowserRouter>
  
      <Routes>
        
        <Route path='/' element={ <MainRoutes isLoaded={isLoaded} /> } />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />  
        {/* <Route  path='/' element={<> <Home /></>} /> */}
        <Route  path='/ticker/:ticker' element={ <><NavBar /> <Ticker /> <NavBarMobile /> </> } />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
