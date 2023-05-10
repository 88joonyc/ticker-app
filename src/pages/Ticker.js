import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'

import InfoPanel from "../components/infoPanel";
import ControlPanel from "../components/controlPanel";

export default function Ticker () {

    const { ticker } = useParams();

    // console.log('herresults', data, news)

    return (
        <>
            <div className="max-w-[1440px] mx-auto">
                <div className="relative">
                     <div className="grid grid-cols-[3fr,1fr] gap-20">
                        <div>
                            <InfoPanel ticker={ticker} />
                        </div>
                        <ControlPanel ticker={ticker}/> 
                     </div>
    

                    
                </div>
            </div>
            {/* <LineChart className=" m-5" width={1000} height={800} data={dataPoints}>
                <Line type="monotone" dataKey="c" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
            </LineChart> */}


        </>
    )
};