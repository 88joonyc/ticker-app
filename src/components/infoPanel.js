import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryLine, VictoryGroup, VictoryScatter } from 'victory';
import { csrfFetch } from "../store/csrf";

export default function InfoPanel({ticker, data, meta, image, news, findmeta}) {
    var today = new Date();
    var todaysDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay();
    var dayBefore =  new Date(today.setDate(today.getDate()-2)).toISOString().split('T')[0]
    

    // export this fropm a tool
    var dayCounter = function(days) {
        return new Date(today.setDate(today.getDate()-days)).toISOString().split('T')[0]
    }

    const [multiplier, setMultiplier] = useState(1);
    const [timespan, setTimespan] = useState('minute');
    const [start, setStart] = useState(dayCounter(3));
    const [end, setEnd] = useState(dayBefore);
    const [limit, setLimit] = useState(2000);
    const [sort, setSort] = useState('asc');
    const [adjusted, setAdjusted] = useState(false);

    const [dataPoints, setDataPoints] = useState([])

    const [day, setDay] = useState(2)

    const [disclose, setDisclose] = useState(false);

    const [error, setError] = useState([])

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
        findmeta(payload)
    }, [ticker, start])

    let keyStats
    let pastYield 
    if (data.results) {
        keyStats = data?.results[data?.results?.length-1] 
        pastYield = (data?.results[data?.results?.length-1].c - data?.results[0].c).toFixed(2)
    }


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
        <div className="">
            <div>
                <h1 className="text-2xl md:text-4xl mb-0 md:mb-4 mt-0 md:mt-8 ml-4">{meta.results?.name}</h1>
                {data.results&&(
                    <div className="ml-4">
                        <h2 className="text-3xl md:text-5xl">${data.results[data?.results?.length-1].c}</h2> 
                        <div className=" text-sm md:text-xl"><span className={pastYield > 0 ? 'text-green-500' : 'text-red-300'}>${pastYield}</span> Past </div> 
                    </div>
                )}
            </div>
            <div className="md:hidden">
                <VictoryChart height={400} padding={{ top: 50, bottom: 50, right: 0, left: 0 }}>
                    <VictoryLine data={data.results} style={{ data: {stroke: "#280137" }}} y="c" />
                    <VictoryAxis style={{ axis: {stroke: "transparent"}, ticks: {stroke: "transparent"}, tickLabels: { fill:"transparent"} }}/>
                </VictoryChart> 
            </div>
            <div className="hidden md:block">
                <VictoryChart height={200} padding={{ top: 50, bottom: 50, right: 0, left: 0 }}>
                    <VictoryLine data={data.results} style={{ data: {stroke: "#280137" }}} y="c" />
                    <VictoryAxis style={{ axis: {stroke: "transparent"}, ticks: {stroke: "transparent"}, tickLabels: { fill:"transparent"} }}/>
                </VictoryChart> 
            </div>

            <div className="mr-2 md:mr-0">

                <div className="flex text-lg md:text-xl mb-4 md:mb-8 ml-4 justify-between md:justify-normal md:gap-10">
                    <div type="radio" className={`cursor-pointer ${day == 2 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(2)} value={2}>1D</div>
                    <div type="radio" className={`cursor-pointer ${day == 8 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(8)} value={8}>1W</div>
                    <div type="radio" className={`cursor-pointer ${day == 31 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(31)} value={31}>1M</div>
                    <div type="radio" className={`cursor-pointer ${day == 91 ? 'font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ' : 'text-black'} hover:font-bold hover:text-[#280137]`} onClick={() => handleChange(91)} value={91}>3M</div>
                    <div type="radio" className={`cursor-pointer ${day == 366 ? `font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ` : 'text-black'}`} onClick={() => handleChange(366)} value={366}>1Y</div>
                    <div type="radio" className={`cursor-pointer ${day == 1827 ? `font-bold text-[#280137] border-b-4 border-[#280137] pb-4 ` : 'text-black'}`} onClick={() => handleChange(1827)} value={1827}>5Y</div>
                </div>

                <div>
                    <h2 className="text-lg md:text-xl border-b pb-2 md:pb-8 font-bold ml-4"> About {ticker}</h2>
                    <h3 className="py-8  text-sm md:text-base ml-4">{meta.results?.description}</h3>
                    <div className="grid grid-cols-2  md:flex justify-between mb-4 md:mb-8 ml-4">
                        <div className=" text-sm">
                            <h2 className="mb-2 font-bold">Employees</h2>
                            <h3>{meta.results?.total_employees}</h3>
                        </div>
                        <div className=" text-sm">
                            <h2 className="mb-2 font-bold">Headquarters</h2>
                            <h3>{meta.results?.address?.city}, {meta.results?.address?.state}</h3>
                        </div>
                        <div className=" text-sm mt-2 md:mt-0">
                            <h2 className="font-bold mb-2">List Date</h2>
                            <h3>{meta.results?.list_date}</h3>
                        </div>
                    </div>

                    <div className="">
                        <h2 className="text-lg md:text-xl border-b pb-2 md:pb-8 font-bold ml-4">Key {ticker} statistics</h2>
                        <div className="py-8 ml-4 grid grid-cols-2 md:grid-cols-4 gap-y-4 text-sm mb-8">
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
                        <h2 className="border-b pb-2 md:pb-8 ml-4  mb-4 md:mb-8 flex justify-between align-bottom text-sm md:text-base"><span className="text-lg md:text-xl font-bold">{ticker} News</span><span className="flex items-end md:hover:text-highlightPurple">show more</span></h2>
                        <div>
                            {news.results?.map((report, idx) => (
                                <>
                                    {idx < 3 && <>
                                    <div className="flex justify-between hover:bg-gray-100 hover:cursor-pointer p-4 gap-8">
                                        <div className="pt-4 pb-4">
                                            <div className=" text-xs md:text-sm mb-2">{report?.author}</div> 
                                            <div className=" text-xs md:text-sm font-bold">{report?.title}</div>
                                            <div className="text-sm md:text-base text-gray-500">{report?.description != undefined&&report?.description?.substring(0, 60) + '...'}</div>
                                        </div>
                                        <img className="object-cover w-10 h-10 md:h-[200px] md:w-[200px] text-center" src={report.image_url} />
                                    </div>
                                    </>} 
                                </>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ml-4 mt-8 mb-8">
                    {!disclose&&<div className="mb-4 text-xs md:text-md text-gray-500">
                        All investments involve risks, including the loss of principal. Securities trading offered through Gotham Financial LLC, Member SIPC and a registered broker-dealer. 
                    </div>}
                    <div className="text-midnightPurple font-bold text-sm hover:cursor-pointer hover:text-purple-950" onClick={() => setDisclose(!disclose)}>
                    
                        {disclose&&
                        <div className=" text-gray-500 text-sm mb-4 font-light">
                            All investments involve risks, including the loss of principal. Past performance is no guarantee of future results. The provision of this information does not constitute investment advice or a recommendation of any security, transaction, account type, investment strategy involving securities, or order. Securities trading offered through Robinhood Financial LLC, 
                            Member SIPC
                            , a registered broker-dealer , and a subsidiary of Robinhood Markets, Inc.
                            <br />
                            <br />
                            Options trading entails significant risk and is not appropriate for all investors. Options transactions are often complex and may involve the potential of losing your entire investment. Investors should consider their investment objectives and risks carefully before investing in options. To learn more about the risks associated with options, please read the 
                            Characteristics and Risks of Standardized Options
                            before you begin trading options. Supporting documentation for any claims, if applicable, will be furnished upon request.
                            <br />
                            <br />
                            The line chart allows you to select different time spans ranging from 1 day to 5 years and each time span plots a time interval. The 1 day span and weekly spans, there is additional logic to only show the interval when trades occur. This allows you to see when trading volume occurs during periods of slower activity like extended hours or thinly traded equities. The candlestick chart works in the same manner. Trading during extended hours involves additional risks such as increased price volatility and lower trading volume.
                            <br />
                            <br />
                            There are additional, unique risks with trading during extended hours you should be aware of before making an investment decision, including the risk of lower liquidity, increased volatility, greater spreads, and pricing uncertainty. Please review the 
                            Extended Hours Trading Disclosure
                            for more information concerning these risks.
                            <br />
                            <br />
                            The People Also Own feature is provided for informational purposes only and is not a recommendation to buy, hold, or sell any security. Robinhood uses a proprietary statistical model to predict the securities that are most likely to be held by other Robinhood users that hold the security displayed. The model looks for correlation among sufficiently large portfolios and controls for the fact that some securities are broadly held in general. The feature is not customized per user. The data is generally updated daily.
                            <br />
                            <br />
                            The Analyst Ratings feature, including the percentages of Buy, Hold, and Sell ratings and any price targets or other third party analyst information, collects information from third-party sources and is for informational purposes only. It is not intended to serve as a recommendation to a customer to buy, hold or sell any security in their self-directed Robinhood account, or any other account. ”Buy” aggregates both “Buy” and “Overweight” ratings from third party analysts, “Hold” aggregates “Hold” ratings from third party analysts, and “Sell” aggregates both “Sell” and “Underweight” ratings from third party analysts. Analyst ratings and related content is provided by third party market data providers. Robinhood does not guarantee the accuracy, timeliness or completeness of any third-party information.
                            <br />
                            <br />
                            Information provided by Morningstar or contained under the “Bulls Say” and “Bears Say” headings: (1) is proprietary to Morningstar Research Services LLC, Morningstar, Inc. and/or their content providers; (2) may not be copied or distributed; and (3) is not warranted to be accurate, complete or timely. Neither Morningstar Research Services, Morningstar nor their content providers are responsible for any damages or losses arising from any use of this information. Access to or use of the information contained herein does not establish an advisory or fiduciary relationship with Morningstar Research Services, Morningstar, Inc. or their content providers. Past performance is no guarantee of future results. ©2022 Morningstar. All Rights Reserved. Robinhood does not guarantee the accuracy, timeliness or completeness of any third-party information.
                            <br />
                            <br />
                            Certain fundamental, market data, or other information is provided by FactSet Research Systems, Inc. (Copyright © 2022 FactSet Research Systems Inc. All rights reserved.), by Xignite (xignite.com), ICE Data Services, and/or other third party providers. Realtime quote and/or trade prices are not sourced from all markets. Robinhood does not make any warranty or guarantee relating to the accuracy, timeliness or completeness of any third-party information.
                            <br />
                            <br />
                            Lists may be generated using a combination of data from Morningstar Research Services, LLC, Morningstar, Inc. and/or FactSet Research Systems Inc. and/or their content providers and public filing information from the U.S. Securities and Exchange Commission EDGAR database. Information may not be current. ©2022 Morningstar. © 2022 FactSet Research Systems Inc. All Rights Reserved. Lists are provided for informational purposes only by Robinhood Markets, Inc., and are not investment advice or a recommendation to buy, hold, or sell any security. Robinhood Lists are not personalized recommendations, and the securities listed may not be suitable for you. You should not buy or sell any security on a Robinhood List without first determining it is appropriate for your portfolio or investment strategy.
                        </div>}

                        {disclose == false ? 'Full disclosure' : 'Show Less'}
                    </div>
                </div>
            </div>
        </div>
    )
};