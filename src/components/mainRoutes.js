import React from "react";
import { Route,  Routes  } from 'react-router-dom'


import NavBar from './navBar';
import { useSelector } from "react-redux";
import Home from "../pages/Home";


export default function MainRoutes () {

    const session = useSelector(state => state.session.user);

    return (    
        <>      
        <NavBar />
        <Routes>
            <Route  path='/' element={<> <Home /></>} />
            {/* <Route  path='/ticker/:ticker' element={<Ticker /> } /> */}
        </Routes>
        </>

    )
}