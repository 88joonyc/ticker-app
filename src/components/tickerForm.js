
import React, { useState } from "react"
import TickerCharts from "./tickerCharts";

export default function TickerForm () {

    const [ticker, setTicker] = useState('');
    const [multiplier, setMultiplier] = useState('');
    const [timespan, setTimespan] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [limit, setLimit] = useState('');
    const [sort, setSort] = useState('');
    const [adjusted, setAdjusted] = useState('');

    const [data, setData] = useState({});
    const [meta, setMeta] = useState({});
    const [image, setImage] = useState('');
    const [news, setNews] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // const payload = {
        //     ticker : 'AAPL',
        //     multiplier : 2,
        //     timespan : 'minute',
        //     start : '2023-02-04',
        //     end : '2023-02-14',
        //     limit: 300,
        //     sort: 'asc',
        //     adjusted: true
        // }

        const payload = {
            ticker,
            multiplier,
            timespan,
            start,
            end,
            limit,
            sort,
            adjusted
        }

        // const data = await fetch('http://localhost:5314/api/search', {
        //     method:"POST",
        //     headers: {"Content-Type": 'application/json'},
        //     body: JSON.stringify(payload)
        // })
        
        // const metaData = await fetch(`http://localhost:5314/api/ticker/details/${ticker}`)
        
        const headerOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_POLYGONAPISECRETEKEY}`
            }
        }

        await Promise.all([
            fetch('/api/search', {
                method:"POST",
                headers: {"Content-Type": 'application/json'},
                body: JSON.stringify(payload)
            }).then(async res => setData(await res.json()))
              .catch(err => console.log(err)),
            fetch(`/api/ticker/details/${ticker}`)
            .then(async res => await res.json())
            .then(async returndata => {
                setMeta(returndata);
                const imageData = returndata.results.branding.logo_url;
                if (imageData) {
                    return fetch(imageData, headerOptions, {
                        // method: "POST",
                        // headers:  {
                        //     "Content-Type": 'application/json',
                        //     'Accept': 'image/svg+xml'
                        // },
                        // body: JSON.stringify({
                        //     image: imageData,
                        // })
                    }).then(async res => setImage(await res.text())).catch(err => console.log(err))
                    
                }
            })
            .catch(err => console.log(err)),
            fetch(`/api/ticker/news/${ticker}`)
            .then(async res => await res.json())
            .then(data => setNews(data))
            .catch(err => console.log(err))
        ]);

        // if (data.ok) setData(await data.json())
        // if (meta.ok) setMeta(await meta.json())
    }

    return (
        <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-[1fr,4fr]">  
                <div className='border h-[1550px] mt-20 m-auto'>
                    <form className='flex flex-col border p-10' onSubmit={handleSubmit}>
                        <label for='ticker'> Stock ticker
                            <input className="p-2 border mb-4 mt-1 " name='ticker' onChange={e => setTicker(e.target.value)} type='text'required/>
                        </label>
                        <label for='multiplier'> multiplier
                            <input className="p-2 border mb-4 mt-1" name='multiplier' onChange={e => setMultiplier(e.target.value)} type='number'required/>
                        </label>
                        <label className="flex flex-col mb-4" for='timespan'> timespan
                            <select className="p-2 mt-1" name='timespan' onChange={e => setTimespan(e.target.value)} >
                                <option value='' >--please select--</option>
                                <option value='minute' >minute</option>
                                <option value='hour' >hour</option>
                                <option value='day' >day</option>
                                <option value='week' >week</option>
                                <option value='month' >month</option>
                                <option value='quarter' >quarter</option>
                                <option value='year' >year</option>
                            </select>
                        </label>
                        <label className="flex flex-col mb-4" for='start'> from start
                            <input className="p-2 mt-1 border" name='start' type='date' onChange={e => setStart(e.target.value)} required/>
                        </label>
                        <label className="flex flex-col mb-4" for='end'> to end
                            <input className="p-2 mt-1 border" name='end' type='date' onChange={e => setEnd(e.target.value)} required/>
                        </label>
                        <label className="flex justify-between" for='limit'> adjusted
                            <input className="p-2 mt-1 border" name='limit' type='checkbox' value='true' onChange={e => setAdjusted(e.target.value)} />
                        </label>
                        <div className="flex flex-col mb-4 mt-8" onChange={e =>setSort(e.target.value)} >
                            <label className="flex justify-between"> forwards
                                <input name="sort" type="radio" value="asc" />
                            </label>
                            <label className="flex justify-between"> reverse
                                <input name="sort" type="radio" value="dsc" />
                            </label>
                        </div>
                        <label className="flex flex-col mb-4" for='limit'> limit
                            <input className="p-2" name='limit' type='range' min={0} max={5000} onChange={e => setLimit(e.target.value)} required/>
                        </label>
                        <button className="mt-8 border p-3 rounded bg-blue-300 text-white hover:shadow-lg shadow-grey-400">submit</button>
                    </form>
                </div>
                {data.results&&meta &&<TickerCharts data={data.results} meta={meta} logoimage={image} news={news}/>}
            </div>
        </div>
    )
}



