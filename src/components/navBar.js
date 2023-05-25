import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { csrfFetch } from "../store/csrf";

import logo from './batmanlogo.png'
import * as sessionActions from '../store/session'

export default function NavBar() {
    const dispatch = useDispatch();

    const [ keyword, setKeyword ] = useState();
    const [ searchQuery ] = useDebounce(keyword, 500);
    const [ bestMatches, setBestMatches ] = useState([])
    const [ showMenu, setShowMenu ] = useState(false);

    const session = useSelector(state => state.session.user)
    const toggleMenu = (e) => {
      e.stopPropagation()
      setShowMenu(!showMenu);
    };
    
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = () => {
        setShowMenu(false);
      };
  
      document.addEventListener('click', closeMenu);
    
      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    useEffect(() => {
        const delayDebounceSearch = setTimeout(async () => {
            if (searchQuery) {
                try {
                    const response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/ticker/search/by/${searchQuery}`, {
            
                    } )
                    let data 
                    if (response.ok) {
                        data = await response.json()
                        console.log('this ranm')
                        setBestMatches([...data.bestMatches])
                    }
                } catch (err) {
                    console.log(err)
                }
            }
            return () => clearTimeout(delayDebounceSearch)
        }, 500)
    }, [searchQuery])


    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
      };

    return (
        <div className={`mx-auto sticky z-40 bg-white top-0 left-0  ${!session?.id && 'border'}`}>
            <div className="max-w-[1440px] flex mx-auto items-center px-4 justify-between">
                <Link to='/' className="">
                    <img className="w-[120px] h-[20px] object-contain" src={logo} />
                </Link>

                <div className="mx-auto p-2 relative flex justify-center">
                    <input className={`px-2 py-3 pl-8s text-sm  w-[500px] ${searchQuery ? 'rounded-t' : 'rounded-md'} border border-grey-100`} placeholder="search" onChange={e => setKeyword(e.target.value)}/>
                    {searchQuery&&<div className="absolute top-[53px] right-[8px]">
                        <div className=" w-[500px] opacity-85 bg-white">
                            {bestMatches.map((matches, idx) => (
                                <Link to={`/ticker/${matches['1. symbol']}`} key={`${matches['1. symbol']} -- ${idx}`} onClick={() => setKeyword('')}>
                                    <div className="border p-3 text-xs flex justify-between hover:text-white hover:bg-midnightPurple">
                                        <div >{matches['1. symbol']}</div>
                                        <div >{matches['2. name']}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>}
                </div>

                <div className="flex md:gap-8 text-xs font-medium">
                    {!session&&<>
                        <Link to='/login' className="hover:text-midnightPurple hover:cursor-pointer">Log In</Link>
                        <Link to='/signup' className="hover:text-midnightPurple hover:cursor-pointer">Sign Up</Link>
                    </>}
                    {session&&<>
                        <div className="hover:cursor-pointer" onClick={toggleMenu}>Account</div>
                        <div>
                        {showMenu && (
                            <ul className="absolute border top-0 right-0">
                                {/* <li>{user.username}</li> */}
                                {/* <li>{user.email}</li> */}
                                <li>
                                    <div>{session?.fullName}</div>
                                    <button onClick={logout}>Log Out</button>
                                </li>
                                </ul>
                            )}
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}