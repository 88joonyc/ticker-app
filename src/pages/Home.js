import react, { useState, useEffect } from 'react';

import { VictoryChart, VictoryArea, VictoryAxis, VictoryLine, VictoryGroup, VictoryScatter } from 'victory';
import ControlPanel from '../components/controlPanel';
import Wallet from '../components/wallet';
import Ticker from './Ticker';
import SidePanel from '../components/sidePanel';
import { useSelector } from 'react-redux';
import { csrfFetch } from '../store/csrf';


export default function Home () {

    const [data, setData] = useState({})

    const [list, setList] = useState([]);
    const [orig, setOrigi] = useState({});
    const [once, setOnce] = useState(true)
    const [avg, setAvg] = useState(0)

    const stocks = useSelector(state => state?.stock?.stock)
    const today = new Date();
    var todaysDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay();
    var dayBefore =  new Date(today.setDate(today.getDate()-2)).toISOString().split('T')[0]
    
    var dayCounter = function(days) {
        return new Date(today.setDate(today.getDate()-days)).toISOString().split('T')[0]
    }

    useEffect(() => {
        async function run() {
            console.log('thisisrunning')
            let response
            try{
                response = await csrfFetch('http://localhost:5314/api/ticker/search/multiple', {
                    method: 'POST',
                    'Content-type': 'application/JSON',
                    body: JSON.stringify({
                        symbols: stocks?.map(stock => stock?.ticker),
                        to: dayBefore,
                        from: dayCounter(350),
                    })
                })
            } catch(err) {
                console.log(err)
            }
            const data = await response.json()
            setData(data)
            console.log(data)
            return data
        }

        const complete = function (entries, type) {
            let list = []
            for (const [idx, [key, val]] of Object?.entries(Object?.entries(entries.pass))) {
                
                for (let j = 0; j < val.length; j++) {
                    
                    if (list?.length == val?.length) {
                        list[j] = (list[j]+(val[j]?.close * entries.obj[key]?.qty  ))
                    } else {
                        list.push(val[j]?.close)
                    }
                }
            }
            setList(list.reverse())  
            return list
        }
        
        if (stocks?.length > 0 && once) {
            run()
            .then((data) => original(data))
            .then((data) => complete(data))
            .catch(err => console.log(err))
            
            setOnce(false)
        }
    }, [stocks])
    
    const original = function (pass) {
        let obj = {}
        let sum = 0
        stocks.forEach(tick => {
            sum += (tick.originalPrice * tick.qty)
            obj[tick.ticker]={ qty: tick?.qty, originalPrice: tick?.originalPrice} 
        })  
        setOrigi(obj)
        setAvg(sum)
        return {pass, obj}
    };

    return (
        <>
            <div className='max-w-[1440px] mx-auto'> 
                <div className='grid grid-cols-[3fr,1fr] px-6'>
                     <div className='mr-4'> {/* // may change */}
                     <h1 className={`text-4xl `}>
                        ${(list[0] )?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                     </h1>
                     <div className={`text-xl ${list[0] > avg ? 'text-green-500' : 'text-red-500'}`}>
                        ${(list[0] - avg).toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                     </div>
                     <div>

                        <VictoryChart padding={{ top: 50, bottom: 50, right: -50, left: -50 }}>
                            {/* <VictoryArea data={data.AMZN} style={{ data: {fill: "#280137" }}} y="close" /> */}
                            {/* <VictoryLine data={list}  style={{ data: {stroke: "#280137" }}} y="close" /> */}
                            {/* <VictoryLine data={data.AAPL}  style={{ data: {stroke: "#280137" }}} y="close" /> */}
                             <VictoryGroup  data={list}  y="close" x="none"  >
                                <VictoryLine style={{ data: {stroke: `${list[0] > avg ? "#22c55e" : "#ef4444"}  ` }}}  />
                                <VictoryAxis  offsetY={150} tickFormat={() => ''} />
                                {/* <VictoryScatter /> */}
                            </VictoryGroup>
                        </VictoryChart>
                     </div>
                        <Wallet />
              
                    </div>
                    <div>
                        <SidePanel list={list} data={data} />
                    </div>
                    
                </div>
            </div>
        </>
    )
};