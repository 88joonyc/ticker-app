import react from 'react';
import { FaCircle, FaPowerOff, FaAddressCard, FaLaptop, FaMoneyBill } from "react-icons/fa";

export default function NavBarMobile () {
    const href = window.location.href
    
    return (
        <>
            <div className=' md:hidden sticky bottom-0 py-6 bg-white z-[100]'>
                <div className='flex justify-around'>
                    <Link to='/'>
                        <FaLaptop style={{ fontSize: '25px', color: `${ ( href === 'https://ticker-app-production.up.railway.app/') ? '#000000' : '#9f93a6'}` }} />
                    </Link>
                    <FaAddressCard style={{ fontSize: '25px', color: '#9f93a6' }} />
                    {/* <button onClick={() => setOpenWallet(true)}> */}
                        <FaMoneyBill style={{ fontSize: '25px', color: `${!openWallet ? '#9f93a6' : '#000000'}` }} />
                    {/* </button> */}
                    {/* <button onClick={() => setShowMenu(true)}> */}
                        <FaPowerOff style={{ fontSize: '25px', color: `${!showMenu ? '#9f93a6' : '#000000'}` }} />
                    {/* </button> */}
                </div>
            </div>
        </>
    )
}