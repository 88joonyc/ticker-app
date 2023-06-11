import React, {useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import SearchBar from "./searchBar";

import logo from './batmanlogo.png'
import * as sessionActions from '../store/session'

export default function NavBar() {
    const dispatch = useDispatch();
    const [ showMenu, setShowMenu ] = useState(false);

    const [ showMobileSearch, toggleMobileSearch ] = useState(false)

    const session = useSelector(state => state.session.user)

  
    const toggleMenu = (e) => {
        e.stopPropagation()
        setShowMenu(!showMenu);
    };
    
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = (e) => {
        setShowMenu(false);
      };
  
      document.addEventListener('click', closeMenu);
    
      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const toggleSearch = e => {
        e.stopPropagation()
        toggleMobileSearch(!showMobileSearch)
    }

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    return (
        <div className={`mx-auto sticky z-40 bg-white top-0 left-0  ${!session?.id && 'border'}`}>
            <div className=" flex mx-auto items-center px-4 justify-between">
                <Link to='/' className="hidden md:block">
                    <img className="w-[120px] h-[20px] object-contain" src={logo} />
                </Link>
                <SearchBar showMenu={showMenu}/>
                <div className="flex md:gap-8 text-xs font-medium">
                    {!session&&<>
                        <Link to='/login' className="hover:text-highlightPurple hover:cursor-pointer">Log In</Link>
                        <Link to='/signup' className="hover:text-highlightPurple hover:cursor-pointer">Sign Up</Link>
                    </>}
                    {session&&<div className="hidden md:block">
                        <div className="hover:text-highlightPurple hover:cursor-pointer" onClick={toggleMenu}>Account</div>
                        <div className="relative ">
                        {showMenu && (
                            <ul className="absolute border top-6 right-0 w-60 bg-white shadow-xl">
                                {/* <li>{user.username}</li> */}
                                <li className="border-b">
                                    <div className="h-10 flex items-center p-4">{session?.fullName}</div>
                                </li>
                                <li className="h-10 flex items-center p-4 hover:bg-fadedPurple ">Gotham's Gold</li>
                                <button className="h-10 flex items-center p-4 w-full hover:bg-fadedPurple " onClick={logout}>Log Out</button>
                                </ul>
                            )}
                        </div>
                    </div>}
                </div>
                <button className="md:hidden h-14" onClick={toggleSearch}>
                    <FaSearch style={{ fontSize: '25px'}}/>
                </button>
            </div>
        </div>
    )
}