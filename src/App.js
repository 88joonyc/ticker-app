import {useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import * as sessionActions from './store/session'
import { wallets } from './store/wallet';

import NavBar from './components/navBar';
import Ticker from './pages/Ticker';
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainRoutes from './components/mainRoutes';
import { stocks } from './store/stock';

function App() {
  const dispatch = useDispatch();
  const [ isLoaded, setLoaded ] = useState(false)
  const [ id, setId ] = useState() 

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
    .then(id => (setId(id)))
    .then(() => setLoaded(true))
  }, [dispatch])
  
  useEffect(() => {
    dispatch(wallets(id))
    dispatch(stocks(id))  
  }, [id])

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
