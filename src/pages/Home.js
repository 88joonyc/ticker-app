import react, { useState, useEffect } from 'react';

import { VictoryChart, VictoryAxis, VictoryLine, VictoryGroup } from 'victory';
import ControlPanel from '../components/controlPanel';
import Wallet from '../components/wallet';
import Ticker from './Ticker';
import SidePanel from '../components/sidePanel';
import { useSelector } from 'react-redux';
import { csrfFetch } from '../store/csrf';
import { SplashPage } from './SplashPage';


export default function Home ({isLoaded}) {

    const session = useSelector(state => state?.session?.user)

    const [data, setData] = useState({})
    const [openWallet, setOpenWallet] = useState(false); 

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
            let response
            try{
                response = await csrfFetch(`${process.env.REACT_APP_RAILWAY_BACK_URL}/api/ticker/search/multiple`, {
                    method: 'POST',
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
            return data
        }

        const complete = function (entries, type) {
            let list = []
            for (const [idx, [key, val]] of Object?.entries(Object?.entries(entries.pass))) {
                
                for (let j = 0; j < val.length; j++) {
                    
                    if (list?.length === val?.length) {
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
            {session?.id&&<>
                <div className='max-w-[1440px] mx-auto'> 
                    <div className='grid md:grid-cols-[78%,22%] md:px-6'>
                        <div className='md:mr-8'> {/* // may change */}
                        <h1 className={`text-2xl md:text-4xl ml-2 md:ml-0`}>
                            ${list[0] > 0 ? (list[0] )?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                        </h1>
                        <div className={`text-xl ml-2 md:ml-0 ${list[0] > avg ? 'text-green-500' : 'text-red-500'}`}>
                            ${list[0] - avg > 0 ? (list[0] - avg)?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                        </div>
                        <div className='hidden md:block'>
                            <VictoryChart height={200} padding={{ top: 50, bottom: 50, right: 0, left: 0 }} >
                                <VictoryGroup  data={list}  y="close" x="none"  >
                                    <VictoryLine style={{ data: {stroke: `${list[0] > avg ? "#22c55e" : "#ef4444"}  `, strokeWidth: 1 }}}  />
                                    <VictoryAxis  offsetY={100} tickFormat={() => ''} style={{ axis: {stroke: '#ffffff', strokeWidth: 1 }}}  />
                                </VictoryGroup>
                            </VictoryChart>
                        </div>
                        <div className='md:hidden'>
                            <VictoryChart height={400} padding={{ top: 50, bottom: 50, right: 0, left: 0 }} >
                                <VictoryGroup  data={list}  y="close" x="none"  >
                                    <VictoryLine style={{ data: {stroke: `${list[0] > avg ? "#22c55e" : "#ef4444"}  `, strokeWidth: 1 }}}  />
                                    <VictoryAxis  offsetY={200} tickFormat={() => ''} style={{ axis: {stroke: '#ffffff', strokeWidth: 1 }}}  />
                                </VictoryGroup>
                            </VictoryChart>
                        </div>
                            <Wallet openWallet={openWallet} setOpenWallet={setOpenWallet}/>
                
                        </div>
                        <div>
                            {openWallet&&<SidePanel list={list} data={data} />}
                        </div>
                        
                    </div>
                </div>            
            </>}
            {!session?.id&&isLoaded&&<>
                <SplashPage />
            </>}
        </>
    )
};