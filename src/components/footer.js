import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faLinkedin, faGithub, faGoogle,  } from "@fortawesome/free-brands-svg-icons"


export const Footer = function () {

    const facebook = <FontAwesomeIcon icon={faFacebook} />
    const linkedin = <FontAwesomeIcon icon={faLinkedin} />
    const github = <FontAwesomeIcon icon={faGithub} />
    const google = <FontAwesomeIcon icon={faGoogle} /> 

    return (
        <>
            <div className="grid grid-cols-[1fr,1fr]">
                <div className="flex text-xl h-28 w-full items-center px-8 border border-black">
                    <a>some weblink</a>
                </div>
                <div className="flex text-xl h-28 w-full items-center px-8 border border-black">
                    <div>Follow me at</div><a href="https://www.linkedin.com/in/pchang1216/" className="ml-4">{linkedin}</a><a href="https://www.facebook.com/ayoisspc/" className="ml-4">{facebook}</a><a href="https://github.com/88joonyc" className="ml-4">{github}</a><a href="mailto:joonyc88@gmail.com" className="ml-4">{google}</a>
                </div>
                <div className="h-full text-xl border border-black p-8">
                    <div>
                        long links
            
                      
                    </div>
                </div>
                <div className="h-full text-md border border-black p-8">
                    <div>
                    <p>All investing involves risk.
                            <br/><br/>
                            Brokerage services are offered through Gotham Financial LLC, (“GOF”) a registered broker dealer (member SIPC) and clearing services through Gotham Securities, LLC, (“GOS”) a registered broker dealer (member SIPC). Cryptocurrency services are offered through Wayne Crypto, LLC (“WAC”) (NMLS ID: 1702840). The Hood Money spending account is offered through Hood Money, LLC (“GGY”) (NMLS ID: 1990968), a licensed money transmitter. The Gotham Cash Card is a prepaid card issued by Wayne Bank, Member FDIC, pursuant to a license from Mastercard® International Incorporated. RHF, RHY, RHC and RHS are affiliated entities and wholly owned subsidiaries of Gotham Markets, Inc. RHF, RHY, RHC and RHS are not banks. Securities products offered by RHF are not FDIC insured and involve risk, including possible loss of principal. Cryptocurrencies held in RHC accounts are not covered by FDIC or SIPC protections and are not regulated by FINRA. RHY products are not subject to SIPC coverage but funds held in the Gotham Money spending account and Gotham Cash Card account may be eligible for FDIC pass-through insurance (see the Gotham Cash Card Agreement and the Gotham Spending Account Agreement).
                            <br/><br/>
                            Options trading entails significant risk and is not appropriate for all customers. Customers must read and understand the Characteristics and Risks of Standardized Options before engaging in any options trading strategies. Options transactions are often complex and may involve the potential of losing the entire investment in a relatively short period of time. Certain complex options strategies carry additional risk, including the potential for losses that may exceed the original investment amount.
                            <br/><br/>
                            Commission-free trading of stocks, ETFs and options refers to $0 commissions for Wayne Financial self-directed individual cash or margin brokerage accounts that trade U.S. listed securities and certain OTC securities electronically. Keep in mind, other fees such as trading (non-commission) fees, Gold subscription fees, wire transfer fees, and paper statement fees may apply to your brokerage account. Please see Robinhood Financial’s Fee Schedule to learn more.
                            <br/><br/>
                            © 2023 Batman's Hood. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </>
    )
}