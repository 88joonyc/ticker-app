import react, { useState, useEffect } from 'react';

import { useDebounce } from "use-debounce";
import { Link } from "react-router-dom";

export default function SearchBar ({showMenu}) {

    const [ keyword, setKeyword ] = useState();
    const [ bestMatches, setBestMatches ] = useState([])
    const [ searchQuery ] = useDebounce(keyword, 500);


     useEffect(() => {
        const delayDebounceSearch = setTimeout(async () => {
            if (searchQuery) {
                try {
                    const response = await fetch(`/api/ticker/search/by/${searchQuery}`)
                    let data 
                    if (response.ok) {
                        data = await response.json()
                        setBestMatches([...data.bestMatches])
                    }
                } catch (err) {
                    console.log(err)
                }
            }
            return () => clearTimeout(delayDebounceSearch)
        }, 500)
    }, [searchQuery])

    return (
        <>
            {!showMenu&&<div className="hidden mx-auto p-2 relative md:flex justify-center">
                <input className={`px-2 py-2 text-sm lg:w-[500px] ${searchQuery ? 'rounded-t' : 'rounded-md'} border border-grey-100`} placeholder="search" onChange={e => setKeyword(e.target.value)}/>
                {searchQuery&&<div className="absolute top-[53px] md:right-[8px]">
                    <div className="w-[80vw] md:w-[500px] opacity-85 bg-white">
                        {bestMatches.map((matches, idx) => (
                            <Link to={`/ticker/${matches['1. symbol']}`} key={`${matches['1. symbol']} -- ${idx}`} onClick={() => setKeyword('')}>
                                <div className="border p-3  text-xs flex justify-between hover:text-white hover:bg-midnightPurple">
                                    <div >{matches['1. symbol']}</div>
                                    <div >{matches['2. name']}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>}
            </div>}
        </>
    )
}