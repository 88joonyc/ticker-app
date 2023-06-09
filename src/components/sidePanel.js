
import { useSelector } from 'react-redux';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryGroup } from 'victory';
import { Link } from 'react-router-dom';

export default function SidePanel ({data, list}) {

    const stocks = useSelector(state => state.stock.stock)

    return (
        <>
            <div className='border md:h-[90vh] md:mb-0 overflow-y-scroll no-scrollbar text-xs md:sticky top-[60px]' >
                <div className='w-full border-b px-2 py-4 '>
                    <div className='w-full '>Stocks</div>
                </div>
                <div>
                    {stocks&&data&&stocks?.map(stock => (
                        <div key={`stock-identifier-${stock.id}`}>
                            <Link to={`/ticker/${stock?.ticker}`} >
                                <div className={`px-2 py-1 flex justify-between hover:bg-gray-100 text-black`}>
                                    <div className='flex flex-col justify-center'>
                                        <span className='font-bold'>{stock?.ticker}</span>
                                        <span className='font-light'>{stock?.qty} {stock?.qty > 1 ? 'shares' : 'share'}</span>
                                    </div>
                                    <div className='h-16'>
                        
                                    <VictoryChart >
                                        <VictoryGroup >
                                            <VictoryLine data={data?.[stock?.ticker]}  style={{  data: { stroke:data?.[stock?.ticker]?.[0]?.close > stock?.originalPrice  ? "#22c55e" : "#ef4444", strokeWidth: 2} }} y="close"  />
                                            <VictoryAxis  style={{ ticks: {stroke: "grey"} }} invertAxis offsetY={150} tickFormat={() => ''} />
                                        </VictoryGroup>
                                    </VictoryChart>

                                    </div>
                                    <div className='flex flex-col justify-center gap-2 items-center'>
                                        <div>{data?.[stock?.ticker]?.[0]?.close.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                        <div className={data?.[stock?.ticker]?.[0]?.close - stock?.originalPrice > 0 ? 'text-green-500' : 'text-red-500'}>{(data?.[stock?.ticker]?.[0]?.close - stock?.originalPrice)>0&&'+'}{(((data?.[stock?.ticker]?.[0]?.close - stock?.originalPrice)*stock?.qty)/(stock?.originalPrice)*stock?.qty).toFixed(2)}%</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}