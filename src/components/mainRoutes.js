import React from "react";
import { Route,  Routes  } from 'react-router-dom'


import NavBar from './navBar';
import { useSelector } from "react-redux";
import Home from "../pages/Home";

import NavBarMobile from "./navBar-mobile";


export default function MainRoutes ({isLoaded, stocksData, total, current, list}) {

    const session = useSelector(state => state.session.user);

    return (    
        <>      
        <NavBar />
        <Routes>
            <Route  path='/' element={<> <Home isLoaded={isLoaded} stocksData={stocksData} total={total} current={current} list={list} /></>} />
            {/* <Route  path='/ticker/:ticker' element={<Ticker /> } /> */}
        </Routes>
        <NavBarMobile/>
        </>

    )
}