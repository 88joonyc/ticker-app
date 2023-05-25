import react, { useState } from 'react';
import { purchase } from '../store/stock';
import { useDispatch, useSelector } from 'react-redux';
import { directUpdate } from '../store/wallet';
import { useNavigate } from 'react-router-dom';

export default function ControlPanel ({ticker, data}) {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.session.user?.id)
    const wallet = useSelector(state => state.wallet)
    const naviagte = useNavigate();

    const [control, setControl] = useState('buy')
    const [type, setType] = useState('shares')
    const [qty, setQty] = useState('')
    const [account, setAccount] = useState('')

    const submitPurchase = async function (e) {
        e.preventDefault()
        console.log( data?.results[data?.results?.length-1]?.c * qty )

        const isuserbroke = await dispatch(directUpdate({
            userId,
            accountType: account,
            amount: data?.results[data?.results?.length-1]?.c * qty 
        })
        )

        if (!isuserbroke.wallet.message){
            if (window.confirm(`Are you sure you want to spend ${data?.results[data?.results?.length-1]?.c * qty}?`)) {
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
            }
        } else {
            alert(isuserbroke.wallet.message)
        }

    }

    return (
        <>
            <div className='max-w-[400px] relative '>
                <div className='flex flex-col border border-gray-200  p-8 sticky top-[120px] shadow-lg'>
                    <div className='text-xl mb-8 font-bold capitalize text-midnightPurple '>{control + ' ' + ticker}</div>
                    <form onSubmit={submitPurchase} className='flex flex-col'>
                        <label className='text-base flex justify-between'> Buy in
                            <select className='border bg-white p-2 w-[120px] ' onChange={e => setType(e.target.value)}>
                                <option value='shares'>Shares</option>
                                {/* <option value='dollars'>Dollars</option> */}
                            </select>
                        </label>
                        <label className='text-base py-8 flex justify-between items-center'> <span className='capitalize'>{type}</span>
                            <input className='py-2 px-4  border w-[120px]' type="number" min={0} onChange={e => setQty(e.target.value)} />
                        </label>
                        <label className='text-base flex justify-between'> Pay by
                            <select className='border bg-white p-2 w-[120px] ' onChange={e => setAccount(e.target.value)}>
                            <option className='' value={``}>-- Choose an account type --</option>
                                {wallet.wallet.map(money => (
                                    <>
                                        <option value={`${money.accountType}`}>{money.accountType}</option>
                                    </>
                                ))}
                                {/* <option value='dollars'>Dollars</option> */}
                            </select>
                        </label>
                        <button className='p-4 border rounded-full  my-8 text-xl text-white font-bold bg-midnightPurple hover:bg-purple-950'>review order</button>
                    </form>
                </div>
            </div>
        </>
    )
}