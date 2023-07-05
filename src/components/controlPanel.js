import react, { useState, useEffect } from 'react';
import { purchase } from '../store/stock';
import { useDispatch, useSelector } from 'react-redux';
import { directUpdate } from '../store/wallet';
import { Navigate, useNavigate } from 'react-router-dom';
import { Redirect } from 'react-router';

export default function ControlPanel ({ticker, data}) {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.session.user?.id)
    const wallet = useSelector(state => state.wallet)
    const naviagte = useNavigate();

    const [control, setControl] = useState('buy')
    const [type, setType] = useState('shares')
    const [qty, setQty] = useState('')
    const [account, setAccount] = useState('dollars')

    const [ showMenu, setShowMenu ] = useState(false);
    const toggleMenu = (e) => {
        e.stopPropagation()
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;
    
        const closeMenu = (e) => {
          setShowMenu(false);
        };
    
        document.addEventListener('click', closeMenu);
      
        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);


      const submitPurchase = async function (e) {
        e.preventDefault()

        if (window.confirm(`Are you sure you want to spend ${data?.results[data?.results?.length-1]?.c * qty}?`)) {
            const isuserbroke = await dispatch(directUpdate({
                userId,
                accountType: account,
                amount: data?.results[data?.results?.length-1]?.c * qty 
                })
            )

            console.log('checking', isuserbroke)
        
            if (!isuserbroke.wallet.message){
                const response = await dispatch(purchase({
                    ticker,
                    originalPrice: data.results[data?.results?.length-1].c,
                    qty,
                    userId,
                }))
        
                if (response.response.response) {
                    alert("Purchase complete!")
                    naviagte("/")
                } 

            } else {
                alert(isuserbroke.wallet.message)
            }
        }
    }

    const getPower = function() {
        if (wallet.wallet) {
            let type = wallet.wallet.filter(power => power.accountType === account)
            return type[0]?.buyingPower
        }
    }



    return (
        <>
            <div className='md:max-w-[400px] relative'>
                <div className='flex flex-col border border-gray-200 pt-6  sticky top-[120px] shadow-lg'>
                    <div className='flex'>
                        <button onClick={() => setControl('buy')} className={`text-xl mb-8 font-bold capitalize hover:text-highlightPurple px-6 ${control == 'buy' ? 'text-highlightPurple border-b-4 border-highlightPurple' : 'text-midnightPurple' }`}>Buy{' ' + ticker}</button>
                        <button onClick={() => setControl('sell')} className={`text-xl mb-8 font-bold capitalize hover:text-highlightPurple px-6 ${control != 'buy' ? 'text-highlightPurple border-b-4 border-highlightPurple' : 'text-midnightPurple' }`}>Sell{ ' ' + ticker} </button>
                    </div>
                    <form onSubmit={submitPurchase} className='flex flex-col px-6'>
                        <label className='text-base flex justify-between'><span className='capitalize'>{control} in</span>
                            <select className='border bg-white p-2 w-[150px] ' onChange={e => setType(e.target.value)}>
                                <option value='shares'>Shares</option>
                            </select>
                        </label>
                        <div></div>
                        <label className='text-base py-2 flex justify-between items-center'> <span className='capitalize'>{type}</span>
                            <input className='py-2 px-4  border w-[150px] text-right' placeholder='0' type="number" min={0} onChange={e => setQty(e.target.value)} />
                        </label>
                        <div className='flex pt-4 justify-between font-bold'>
                            <div className='text-highlightPurple'>
                                Market Price
                            </div>
                            <div>
                                ${data?.results?.[data?.results?.length-1]?.c ? data?.results[data?.results?.length-1]?.c : 0}
                            </div>
                        </div>
                        <div className='flex pt-4 justify-between font-bold border-t mt-4'>
                            <div>
                               Estimated {control == 'buy' ? 'Cost' : 'Credit'}
                            </div>
                            <div>
                                ${qty ? (qty*data?.results?.[data?.results?.length-1]?.c).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                            </div>
                        </div>
                        <button disabled={qty > 0 ? false : true} className='p-4 border rounded-full my-2 mt-10 text-sm text-white font-bold bg-midnightPurple hover:bg-highlightPurple'>review order</button>
                    </form>
                    <div className='w-full flex justify-center p-4 border-t mt-6'>
                        ${!getPower() ? 0 : getPower().toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} buying power available
                    </div>
                    <button className='hover:bg-fadedPurple w-full flex justify-center py-4 border-t' onClick={toggleMenu}>
                        <label className='text-base flex justify-between cursor-pointer'> {account == 'dollars' ? 'Brokerage' : 'Bitcoin' }
                        </label>
                    </button>
                    {showMenu&&<div>
                    <select className='border bg-white p-2 w-full ' onChange={e => setAccount(e.target.value)} required>

                                <option value={``}>select</option>
                                    {wallet.wallet.map(money => (
                                        <option 
                                            key={`wallet-with-${money.id}`} 
                                            value={`${money.accountType}`}>{money.accountType}
                                        </option>
                                    ))}
                                    {/* <option value='dollars'>Dollars</option> */}
                                </select>
                    </div>}
                </div>
            </div>
        </>
    )
}