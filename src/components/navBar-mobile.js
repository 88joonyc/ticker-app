import react from 'react';
import { FaCircle } from "react-icons/fa";

export default function NavBarMobile () {
    return (
        <>
            <div className=' md:hidden sticky bottom-0 py-10 bg-white'>
                <div className='flex justify-around'>
                    <FaPowerOff style={{ fontSize: '25px' }} />
                    <FaLaptop style={{ fontSize: '25px' }} />
                    <FaAddressCard style={{ fontSize: '25px' }} />
                </div>
            </div>
        </>
    )
}