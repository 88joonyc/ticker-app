import React, { useEffect, useState } from "react";

import { useLocation } from 'react-router-dom'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryLine, VictoryGroup, VictoryScatter } from 'victory';

export default function InfoPanel({ticker}) {
    var today = new Date();
    var todaysDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay();
    var dayBefore =  new Date(today.setDate(today.getDate()-2)).toISOString().split('T')[0]
    

    // export this fropm a tool
    var dayCounter = function(days) {
        return new Date(today.setDate(today.getDate()-days)).toISOString().split('T')[0]
    }

    // const location = useLocation();
    // console.log(location)
    // const ticker = location.ticker
    
    const [multiplier, setMultiplier] = useState(1);
    const [timespan, setTimespan] = useState('minute');
    const [start, setStart] = useState(dayCounter(3));
    const [end, setEnd] = useState(dayBefore);
    const [limit, setLimit] = useState(2000);
    const [sort, setSort] = useState('asc');
    const [adjusted, setAdjusted] = useState(false);

    const [dataPoints, setDataPoints] = useState([])

    const [day, setDay] = useState(2)

    const [data, setData] = useState({});
    const [meta, setMeta] = useState({});
    const [image, setImage] = useState('');
    const [news, setNews] = useState('');
    const [disclose, setDisclose] = useState(false);

    const [error, setError] = useState([])
    
    const headerOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_POLYGONAPISECRETEKEY}`
        }
    }

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

    useEffect(() => {
        async function runme() {
            let data
            try {
                data = await fetch('/api/ticker/search', {
                    method: 'POST',
                    headers: {"Content-Type": 'application/json'},
                    body: JSON.stringify(payload)
                })
            } catch (err) {
                console.log(err)
            }
            const response = await data.json();
            if (response.status == 'OK') {
                console.log('setup error handling;', response)
                setDataPoints(response.results)
            }
        }

        async function findmeta() {
            console.log('thisishuitting')
            await Promise.all([
                fetch('/api/ticker/search', {
                    method:"POST",
                    headers: {"Content-Type": 'application/json'},
                    body: JSON.stringify(payload)
                }).then(async res => setData(await res.json()))
                  .catch(err => console.log(err)),
                fetch(`/api/ticker/details/${ticker}`)
                .then(async res => await res.json())
                .then(async returndata => {
                    setMeta(returndata);
                    const imageData = returndata?.results?.branding?.logo_url;
                    if (imageData) {
                        return fetch(imageData, headerOptions, {
                        }).then(async res => setImage(await res.text())).catch(err => console.log(err))
                        
                    }
                })
                .catch(err => console.log(err)),
                fetch(`/api/ticker/news/${ticker}`)
                .then(async res => await res.json())
                .then(data => setNews(data))
                .catch(err => console.log(err))
            ]);
        } 

        // console.log(start)
        // runme()
        findmeta()

    }, [ticker, start])

    let keyStats
    let pastYield 
    if (data.results) {
        keyStats = data?.results[data?.results?.length-1] 
        pastYield = (data?.results[data?.results?.length-1].c - data?.results[0].c).toFixed(2)
    }
    console.log('this is hit', data)

    if (data.error) {
        alert(`error due to following: ${data.error}`)
    }


    const handleChange = function (num) {

        if (num == 2) {
            setTimespan('minute')
        } else {
            setTimespan('day')
        }
        setDay(num)
        setStart(dayCounter(num))
    }
    return (
        <div>
            <div>
                <h1 className="text-4xl mb-4 mt-8 ml-4">{meta.results?.name}</h1>
                {data.results&&(
                    <div className="ml-4">
                        <h2 className="text-5xl">${data.results[data?.results?.length-1].c}</h2> 
                        <div className="text-xl"><span className={pastYield > 0 ? 'text-green-500' : 'text-red-300'}>${pastYield}</span> Past </div> 
                    </div>
                )}
            </div>

            <VictoryChart >
                {/* <VictoryArea data={data.results} style={{ data: {fill: "#280137" }}} y="c" /> */}
                <VictoryLine data={data.results} style={{ data: {stroke: "#280137" }}} y="c" />
                {/* <VictoryGroup data={data.results}  y="c" >
                    <VictoryLine  />
                    <VictoryScatter />
                </VictoryGroup> */}
            </VictoryChart>

            <div className="flex text-2xl mb-8 ml-4 gap-10">
                <div type="radio" className={`cursor-pointer ${day == 2 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(2)} value={2}>1D</div>
                <div type="radio" className={`cursor-pointer ${day == 8 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(8)} value={8}>1W</div>
                <div type="radio" className={`cursor-pointer ${day == 31 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(31)} value={31}>1M</div>
                <div type="radio" className={`cursor-pointer ${day == 91 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(91)} value={91}>3M</div>
                <div type="radio" className={`cursor-pointer ${day == 366 ? `font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ` : 'text-black'}`} onClick={() => handleChange(366)} value={366}>1Y</div>
                <div type="radio" className={`cursor-pointer ${day == 1827 ? `font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ` : 'text-black'}`} onClick={() => handleChange(1827)} value={1827}>5Y</div>
            </div>

            <div>
                <h2 className="text-3xl border-b pb-8 font-bold ml-4"> About {ticker}</h2>
                <h3 className="py-8 text-xl ml-4">{meta.results?.description}</h3>
                <div className="flex justify-between mb-8 ml-4">
                    <div className="text-xl">
                        <h2 className="mb-2 font-bold">Employees</h2>
                        <h3>{meta.results?.total_employees}</h3>
                    </div>
                    <div className="text-xl">
                        <h2 className="mb-2 font-bold">Headquarters</h2>
                        <h3>{meta.results?.address?.city}, {meta.results?.address?.state}</h3>
                    </div>
                    <div className="text-xl">
                        <h2 className="font-bold mb-2">List Date</h2>
                        <h3>{meta.results?.list_date}</h3>
                    </div>
                </div>

                <div className="">
                    <h2 className="text-3xl border-b pb-8 font-bold ml-4">Key {ticker} statistics</h2>
                    <div className="py-8 ml-4 grid grid-cols-4 gap-y-4 text-lg mb-8">
                        <div>
                            <h3 className="font-bold">High yesterday</h3>
                            <div>{keyStats?.h}</div>
                        </div>
                        <div>
                            <h3 className="font-bold">Low yesterday</h3>
                            <div>{keyStats?.l}</div>
                        </div>
                        <div>
                            <h3 className="font-bold">Volume</h3>
                            <div>{keyStats?.v}</div>
                        </div>
                        <div>
                            <h3 className="font-bold">Open price</h3>
                            <div>{keyStats?.o}</div>
                        </div>
                        <div>
                            <h3 className="font-bold">Close price</h3>
                            <div>{keyStats?.c}</div>
                        </div>
                    </div>
                </div>

                {/* news - create separate components*/}
                <div>
                    <h2 className="border-b pb-8 ml-4  mb-8 flex justify-between align-bottom"><span className="text-3xl font-bold">{ticker} News</span><span className="flex items-end">show more</span></h2>
                    <div>
                        {news.results?.map((report, idx) => (
                            <>
                                {idx < 3 && <>
                                <div className="flex justify-between hover:bg-gray-100 hover:cursor-pointer p-4 pt-4 pb-4">
                                    <div className="pt-4 pb-4">
                                        <div className="text-xl mb-2">{report?.author}</div> {}
                                        <div className="text-xl font-bold">{report?.title}</div>
                                        <div className="text-lg text-gray-500">{report?.description != undefined&&report?.description?.substring(0, 60) + '...'}</div>
                                    </div>
                                    <img className="object-cover h-[200px] w-[200px]" src={report.image_url} />
                                </div>
                                </>} 
                            </>
                        ))}
                    </div>
                </div>
            </div>

            <div className="ml-4 mt-8 mb-8">
                <div className="mb-4 text-md text-gray-500">
                    All investments involve risks, including the loss of principal. Securities trading offered through Robinhood Financial LLC, Member SIPC and a registered broker-dealer. 
                </div>
                <div className="text-midnightPurple font-bold text-xl hover:cursor-pointer hover:text-purple-950" onClick={() => setDisclose(!disclose)}>
                
                    {disclose&&
                    <div className=" text-gray-500 text-sm mb-4 font-light">
                        All investments involve risks, including the loss of principal. Securities trading offered through Robinhood Financial LLC, 
                        Member SIPC
                        and a registered broker-dealer.

                        All investments involve risks, including the loss of principal. Past performance is no guarantee of future results. The provision of this information does not constitute investment advice or a recommendation of any security, transaction, account type, investment strategy involving securities, or order. Securities trading offered through Robinhood Financial LLC, 
                        Member SIPC
                        , a registered broker-dealer, and a subsidiary of Robinhood Markets, Inc.

                        Options trading entails significant risk and is not appropriate for all investors. Options transactions are often complex and may involve the potential of losing your entire investment. Investors should consider their investment objectives and risks carefully before investing in options. To learn more about the risks associated with options, please read the 
                        Characteristics and Risks of Standardized Options
                        before you begin trading options. Supporting documentation for any claims, if applicable, will be furnished upon request.

                        Please also be aware of the risks listed in the following documents: 
                        Day Trading Risk
                        
                        Disclosure Statement
                        and 
                        FINRA Investor Information
                        .

                        Commission-free trading refers to $0 commissions for Robinhood Financial self-directed individual cash or margin brokerage accounts that trade U.S. listed securities and certain OTC securitie electronically. Keep in mind, other fees such as trading (non-commission) fees, Gold subscription fees, wire transfer fees, and paper statement fees may apply to your brokerage account. Please see Robinhood Financial’s 
                        fee schedule
                        to learn more. The line chart allows you to select different time spans ranging from 1 day to 5 years and each time span plots a time interval. The 1 day span and weekly spans, there is additional logic to only show the interval when trades occur. This allows you to see when trading volume occurs during periods of slower activity like extended hours or thinly traded equities. The candlestick chart works in the same manner.

                        The People Also Own feature is provided for informational purposes only and is not a recommendation to buy, hold, or sell any security. Robinhood uses a proprietary statistical model to predict the securities that are most likely to be held by other Robinhood users that hold the security displayed. The model looks for correlation among sufficiently large portfolios and controls for the fact that some securities are broadly held in general. The feature is not customized per user. The data is generally updated daily.

                        Certain fundamental, market data, or other information is provided by FactSet Research Systems, Inc. (Copyright © 2021 FactSet Research Systems Inc. All rights reserved.), by Xignite (xignite.com), OTC Markets Group, ICE Data Services, and/or other third party providers. Realtime quote and/or trade prices are not sourced from all markets. Robinhood does not make any express or implied warranty or guarantee relating to the accuracy, timeliness or completeness of any third-party information.

                        The Analyst Ratings feature, including the percentages of Buy, Hold, and Sell ratings and any price targets or other third party analyst information, collects information from third-party sources and is for informational purposes only. It is not intended to serve as a recommendation to a customer to buy, hold or sell any security in their self-directed Robinhood account, or any other account. ”Buy” aggregates both “Buy” and “Overweight” ratings from third party analysts, “Hold” aggregates “Hold” ratings from third party analysts, and “Sell” aggregates both “Sell” and “Underweight” ratings from third party analysts. Analyst ratings and related content is provided by third party market data providers. Robinhood does not guarantee the accuracy, timeliness or completeness of any third-party information.

                        Information provided by Morningstar or contained under the “Bulls Say” and “Bears Say” headings: (1) is proprietary to Morningstar Research Services LLC, Morningstar, Inc. and/or their content providers; (2) may not be copied or distributed; and (3) is not warranted to be accurate, complete or timely. Neither Morningstar Research Services, Morningstar nor their content providers are responsible for any damages or losses arising from any use of this information. Access to or use of the information contained herein does not establish an advisory or fiduciary relationship with Morningstar Research Services, Morningstar, Inc. or their content providers. Past performance is no guarantee of future results. ©2021 Morningstar. All Rights Reserved. Robinhood does not guarantee the accuracy, timeliness or completeness of any third-party information.

                        Lists may be generated using a combination of data from Morningstar Research Services, LLC, Morningstar, Inc. and/or FactSet Research Systems Inc. and/or their content providers and public filing information from the U.S. Securities and Exchange Commission EDGAR database. Information may not be current. ©2021 Morningstar. © 2021 FactSet Research Systems Inc. All Rights Reserved. Lists are provided for informational purposes only by Robinhood Markets, Inc., and are not investment advice or a recommendation to buy, hold, or sell any security. Robinhood Lists are not personalized recommendations, and the securities listed may not be suitable for you. You should not buy or sell any security on a Robinhood List without first determining it is appropriate for your portfolio or investment strategy.

                        All information (the “ICE Data Information”) provided by ICE Data Connectivity & Feeds, Inc. (together with its affiliates, collectively referred to as “ICE Data”) is owned by or licensed to ICE Data and any user is permitted to use such Information only for such user’s personal use. In no event shall any user publish, retransmit, redistribute or otherwise reproduce any ICE Data Information in any format to anyone, and no user shall use any ICE Data Information in or in connection with any business or commercial enterprise, including, without limitation, any securities, investment, accounting, banking, legal or media business or enterprise. Prior to relying on any ICE Data Information and/or the execution of a security trade based upon such Information, you are advised to consult with your broker or other financial representative to verify pricing information. The ICE Data Information is provided to the users “as is”. Neither ICE Data, nor any third party data provider, make any express or implied warranties of any kind regarding the ICE Data Information, including, without limitation, any warranty of merchantability or fitness for a particular purpose or use. Neither ICE Data, nor any third party data provider, will be liable to any user or anyone else for any interruption, inaccuracy, error or omission, regardless of cause, in the ICE Data Information or for any damages (whether direct or indirect, consequential, punitive or exemplary) resulting therefrom.

                        Certain Information may be provided directly or indirectly by OTC Markets Group Inc. or its affiliates (“OTC Markets Group Data”). You are not permitted to reproduce, duplicate, copy, sell, trade, resell or exploit for any commercial purpose, any part of, the use of, or access to, OTC Markets Group Data. OTC Markets Group Data is provided “as is,” and there are no warranties of any kind, express, implied or statutory (including, without limitation, timeliness, truthfulness, sequence, completeness, accuracy, freedom from interruption, any implied warranties arising from trade usage, course of dealing, or course of performance, or the implied warranties of merchantability or fitness for a particular purpose).
                    </div>}

                    {disclose == false ? 'Full disclosure' : 'Show Less'}
                </div>
            </div>
        </div>
    )
};