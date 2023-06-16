import react, { useState, useEffect } from 'react';

import { useDebounce } from "use-debounce";
import { Link } from "react-router-dom";

export default function SearchBar ({full}) {

    const [ keyword, setKeyword ] = useState();
    const [ bestMatches, setBestMatches ] = useState([])
    const [ searchQuery ] = useDebounce(keyword, 500);


     useEffect(() => {
        const delayDebounceSearch = setTimeout(async () => {
            if (searchQuery) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/ticker/search/by/${searchQuery}`)
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
            <div className=" mx-auto p-2 relative md:flex justify-center">
                <input className={`px-2 py-2 text-sm ${full ? 'w-full' :'md:w-[500px]' } ${searchQuery ? 'rounded-t' : 'rounded-md'} border border-grey-100`} placeholder="search" onChange={e => setKeyword(e.target.value)}/>
                {searchQuery&&<div className="relative md:absolute top-[53px] md:right-[8px] z-50">
                    <div className="w-full md:w-[500px] opacity-85 bg-white border z-50">
                        <h3 className='pb-4 p-2 text-xs font-bold text-midnightPurple'>Stocks</h3>
                        {bestMatches.filter(ele =>(ele['3. type'] == 'Equity')&&(ele['4. region'] == 'United States')).map((matches, idx) => (
                            <Link to={`/ticker/${matches['1. symbol']}`} key={`${matches['1. symbol']} -- ${idx}`} onClick={() => setKeyword('')}>
                                <div className="p-3 z-[500]  text-xs flex justify-between hover:text-white hover:bg-midnightPurple">
                                    <div >{matches['1. symbol']}</div>
                                    <div >{matches['2. name']}</div>
                                </div>
                            </Link>
                        ))}
                        <h3 className='pb-4 p-2 text-xs font-bold text-midnightPurple'>ETFs</h3>
                        {bestMatches.filter(ele =>(ele['3. type'] == 'ETF')&&(ele['4. region'] == 'United States')).map((matches, idx) => (
                            <Link to={`/ticker/${matches['1. symbol']}`} key={`${matches['1. symbol']} -- ${idx}`} onClick={() => setKeyword('')}>
                                <div className="p-3 z-[500]  text-xs flex justify-between hover:text-white hover:bg-midnightPurple">
                                    <div >{matches['1. symbol']}</div>
                                    <div >{matches['2. name']}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>}
            </div>
        </>
    )
}