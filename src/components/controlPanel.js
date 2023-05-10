import react, { useState } from 'react';

export default function ControlPanel ({ticker}) {

    const [control, setControl] = useState('buy')
    const [type, setType] = useState('shares')
    const [qty, setQty] = useState('')

    return (
        <>
            <div className='max-w-[400px] relative '>
                <div className='flex flex-col border border-gray-200  p-8 sticky top-[120px] shadow-lg'>
                    <div className='text-xl mb-8 font-bold capitalize text-midnightPurple '>{control + ' ' + ticker}</div>
                    <form className='flex flex-col '>
                        <label className='text-[20px] flex justify-between'> Buy in
                            <select className='border bg-white p-2 w-[120px] ' onChange={e => setType(e.target.value)}>
                                <option value='shares'>Shares</option>
                                <option value='dollars'>Dollars</option>
                            </select>
                        </label>
                        <label className='text-[20px] py-8 flex justify-between items-center'> <span className='capitalize'>{type}</span>
                            <input className='py-2 px-4  border w-[120px]' type="number" onChange={e => setQty(e.target.value)} />
                        </label>
                        <button className='p-4 border rounded-full  my-8 text-xl text-white font-bold bg-midnightPurple hover:bg-purple-950'>review order</button>
                    </form>
                </div>
            </div>
        </>
    )
}