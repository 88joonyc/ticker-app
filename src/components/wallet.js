import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create, update } from "../store/wallet";

import {
  Modal,
  Ripple,
  initTE,
} from "tw-elements";

initTE({ Modal, Ripple });

export default function Wallet () {

    const dispatch = useDispatch(); 

    const session = useSelector(state => state.session.user);
    const wallet = useSelector(state => state.wallet.wallet)

    const [toggle, setToggle] = useState(true);// temporary alwayus open
    const [openWallet, setOpenWallet] = useState(false); 

    const [accountType, setAccountType] = useState()
    const [amount, setAmount] = useState()

    const deposit = async function (e) {
        e.preventDefault();
        const existing = wallet.filter(bank => bank.accountType === accountType) 
        if (!existing.length > 0) {
            const response = await dispatch(create({userId:session.id, accountType, amount}))
            const data = await response.json()
            if (data.status == "OK") {
                console.log(data)
                alert('Wallet has been added!')
                setOpenWallet(false)
            } else {
                console.log('error', data)
            }
        } else {
            const response = await dispatch(update({
                userId: session.id,
                accountType,
                amount: amount
            }))
            console.log('checkme------------------------',response)
            if (response?.wallet?.id) {
                alert('funds added to wallet!')
                setOpenWallet(false)
            } else {
                // add error content
                alert('something is wrong')
            }             
        }
    }

    return (
        <>
            <div className={`transition-[height]  linear duration-[.2s] ${toggle ? "h-[330px]" : " h-[130px]"} relative`}>
                <div className="relative ">
                    <div onClick={() =>  setToggle(toggle)} className={`w-full h-20 py-8 border-t border-b ${toggle ? 'bg- rounded-t-xl border' : 'text-black bg-white'} hover:bg-   hover:cursor- flex flex-col justify-center border-b`}>
                        <div className='flex mx-6 flex-col justify-between relative '>
                            <div className="flex justify-between">

                                <span className='font-bold'>{ wallet ? 'Buying Power' : 'Add Wallet'}</span>
                                {wallet.length > 1&&<span className='font-medium'>${wallet?.reduce((acc , curr) => acc.buyingPower + curr.buyingPower)?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>}
                            </div>
                        </div>
                    </div>
                    <>
                        <div className={`w-full mx-auto border absolute top-[80px] border-t hover:text-black transition-[height] rounded-b-xl linear duration-[.2s] ${toggle ? 'bg- drop-shadow-xl  h-[250px] ' : '  h-0 ' }`}>
                            <div className={`grid grid-cols-[1fr,1fr] mx-6 mt-8  ${toggle ? 'block' : 'hidden'}`}>
                                <div class="">
                                    {wallet && wallet?.map(funds => (
                                        <>
                                            <div className="border-b text-blac font-light flex justify-between mb-8">
                                                <div className="">{funds.accountType} </div>
                                                <div>${funds.buyingPower?.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </div>
                                            </div>
                                        </>
                                    ))}
                                    <button onClick={() => setOpenWallet(!openWallet)} className="px-16 py-3 text-sm font-bold text-white bg-midnightPurple w-full rounded-full mt-6">Deposit Funds</button>
                                </div>
                                <div className="font-light text-black mx-8">
                                Buying power represents the total value of assets you can purchase.
                                </div>

                            </div>

                        </div>
                    </>
                </div>
                {}
            </div>
            <div className={`bg-white transition-translate ease-in duration-[0.5s] ${openWallet ? 'translate-y-0  absolute top-0 right-0  h-full w-[100vw] z-[100]' : ' translate-y-[100vh]'}  `}>
                <div className={`${openWallet ? '' : ' hidden'}`}>
                    <button className="absolute right-20 top-10 text-8xl z-[200] cursor-pointer " onClick={() => setOpenWallet(false)}>X</button>
                    <div className="relative w-full h-full flex justify-center items-center ">
                        <div className="text-8xl  border h-[600px] w-[500px] bg-white mt-40"> 
                            <div className="mx-4 mt-20 text-base">
                                <div className="text-2xl mb-16"> Transfer Money

                                </div>
                                <form onSubmit={deposit}>
                                    <label>
                                        <select onChange={(e) => setAccountType(e.target.value)} className="w-full p-4 mb-10" required>
                                            <option value=''>-- select account type --</option>
                                            <option value='dollars'>dollars (USD)</option>
                                            <option value='btc'>BTC</option>
                                        </select>
                                    </label>
                                    <label> amount
                                        <input onChange={e => setAmount(e.target.value)} min={0} max={100000} type="number" className="w-full  border p-2 " required/>
                                    </label>
                                    <div className="text-center mt-10">
                                        <div className="text-gray-400">Daily deposit limit: $100,000</div>
                                        <button className={`mt-4 py-4 px-16  text-base rounded-full font-extrabold text-white ${amount ? 'bg-green-400' : 'bg-gray-400 disabled:'}`}>Review Transfer</button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )

}