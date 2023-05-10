import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

import logo from './batmanlogo.png'
import * as sessionActions from '../store/session'

export default function NavBar() {
    const dispatch = useDispatch();

    const [ keyword, setKeyword ] = useState();
    const [ searchQuery ] = useDebounce(keyword, 500);
    const [ bestMatches, setBestMatches ] = useState([])
    const [ showMenu, setShowMenu ] = useState(false);

    const session = useSelector(state => state.session.user)

    
  
    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
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
                    const response = await fetch(`http://localhost:5314/api/ticker/search/by/${searchQuery}`)
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

    // console.log(bestMatches)

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
      };

    return (
        <div className="mx-auto sticky  z-40 bg-white">
            <div className="max-w-[1440px] flex mx-auto items-center px-4">
                <Link to='/' className="">
                    <img className="w-[120px] h-[20px] object-contain" src={logo} />
                </Link>

                <div className="mx-auto p-4 relative flex justify-center">
                    <input className="p-2 pl-8s text-2xl border w-[600px] rounded-md border-grey-100" placeholder="search" onChange={e => setKeyword(e.target.value)}/>
                </div>

                <div className="relative flex justify-center">
                    {searchQuery&&<div className="absolute ">
                        <div className="top-20 w-[600px] opacity-85 bg-white">
                            {bestMatches.map((matches, idx) => (
                                <Link to={`/ticker/${matches['1. symbol']}`} key={`${matches['1. symbol']} -- ${idx}`} onClick={() => setKeyword('')}>
                                    <div className="border p-3 text-md flex justify-between hover:text-white hover:bg-midnightPurple">
                                        <div >{matches['1. symbol']}</div>
                                        <div >{matches['2. name']}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>}
                </div>

                <div className="flex gap-8 text-lg font-bold">
                    {!session&&<>
                        <Link to='/login' className="hover:text-midnightPurple hover:cursor-pointer">Log In</Link>
                        <Link to='/signup' className="hover:text-midnightPurple hover:cursor-pointer">Sign Up</Link>
                    </>}
                    {session&&<>
                        <div className="hover:cursor-pointer" onClick={openMenu}>Account</div>
                        <div>
                        {showMenu && (
                            <ul className="absolute border top-20 right-20">
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