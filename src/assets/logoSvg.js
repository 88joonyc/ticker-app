import { useState, useEffect } from "react";

export const LogoSvg = () => {
    
    const [hover, setHover] = useState('false')

    useEffect(() => {
        setHover(false)
    }, [])
    
    const svg = `<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 841.9 595.3" xml:space="preserve"><g><path fill="${hover ? '%23A020F0' : '%23280137'}" d="M399.3,211.7c10.1,0,14.1,2,14.1,2l6-25.5c0,0,4.7,19.5,6.7,36.9c2,17.5,32.9,6,59.1,0.7c26.2-5.4,31.5-47.7,31.5-47.7h242.4c0,0-146.4,44.3-109.4,141.7c0,0-216.2-32.9-249.8,102.1h0c-33.6-134.9-249.8-102.1-249.8-102.1c36.9-97.3-109.4-141.7-109.4-141.7h242.4c0,0,5.4,42.3,31.5,47.7c26.2,5.4,57.1,16.8,59.1-0.7c2-17.5,6.7-36.9,6.7-36.9l6,25.5c0,0,4-2,14.1-2H399.3L399.3,211.7z"/></g></svg>`;

    return <img onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="h-[50px]" src={`data:image/svg+xml;utf8,${svg}`} />
};