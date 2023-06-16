import react, { useState, useEffect } from 'react';

import { VictoryChart, VictoryAxis, VictoryLine, VictoryGroup, VictoryContainer } from 'victory';
import Wallet from '../components/wallet';
import SidePanel from '../components/sidePanel';
import { useSelector } from 'react-redux';

import { SplashPage } from './SplashPage';

export default function Home ({isLoaded, stocks, total, current, list}) {
    const [openWallet, setOpenWallet] = useState(false); 
    
    const session = useSelector(state => state?.session?.user)
    const data = useSelector(state => state?.multiple?.multiple)

    return (
        <>
            {session?.id&&<>
                <div className='max-w-[1440px] mx-auto'> 
                    <div className='grid md:grid-cols-[75%,25%] md:px-6'>
                        <div className='md:mr-8'> {/* // may change */}
                        <h1 className={`mt-0 md:mt-8 text-4xl md:text-4xl ml-5 md:ml-0`}>
                        <div className='md:hidden'>
                            Investing
                        </div>
                            ${(total)?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </h1>
                        <div className={` md:text-xl ml-5 md:ml-0 ${current > 0? 'text-green-500' : 'text-red-500'}`}>
                            {current > 0 && '+'}${(current)?.toFixed(2)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </div>
                        {!openWallet&&<>
                            <div className='hidden md:block'>
                                <VictoryChart height={200} padding={{ top: 50, bottom: 50, right: 0, left: 0 }} >
                                    <VictoryGroup  data={ stocks ? list : [] }  y="close" x="none"  >
                                        <VictoryLine style={{ data: {stroke: `${current > 0 ? "#22c55e" : "#ef4444"}  `, strokeWidth: 1 }}}  />
                                        <VictoryAxis  offsetY={100} tickFormat={() => ''} style={{ axis: {stroke: '#ffffff', strokeWidth: 1 }}}  />
                                        {/* <VictoryScatter /> */}
                                    </VictoryGroup>
                                </VictoryChart>
                            </div>
                            <div className='md:hidden'>
                                <VictoryChart 
                                            height={400} 
                                            padding={{ top: 50, bottom: 50, right: 0, left: 0 }} 
                                            containerComponent={
                                                <VictoryContainer 
                                                    style={{
                                                        pointerEvents: "auto",
                                                        userSelect:'auto',
                                                        touchAction:'auto'
                                                    }}
                                                />
                                            }
                                        >
                                    <VictoryGroup  data={ stocks ? list : [] }  y="close" x="none"  >
                                        <VictoryLine style={{ data: {stroke: `${current > 0 ? "#22c55e" : "#ef4444"}  `, strokeWidth: 2 }}}  />
                                        <VictoryAxis  offsetY={200} tickFormat={() => ''} style={{ axis: {stroke: '#ffffff', strokeWidth: 1 }}}  />
                                    </VictoryGroup>
                                </VictoryChart>
                            </div>
                        </>}
                            <Wallet openWallet={openWallet} setOpenWallet={setOpenWallet}/>
                
                        </div>

                        {!openWallet&&<div>
                            <SidePanel list={list} data={data} />
                        </div>}
                        
                    </div>
                </div>            
            </>}
            {!session?.id&&isLoaded&&<>
                <SplashPage />
            </>}
        </>
    )
};