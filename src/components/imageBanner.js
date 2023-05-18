import image from '../'


export const ImageBanner = function ({data}) {

    const info = data.meta;
    const outline = data.options

    return (
        <>
            <div className={`bg-${outline.color} bg-batmanGold w-full text-${outline?.text}`}>
                <div className="grid grid-cols-[1fr,1fr]">
                    <div>
                        <img className='h-full object-cover' src={`${info.image}`}/>
                    </div>
                    <div className="flex flex-col h-[50rem] w-[360px] ml-8">
                        <div className="my-auto">
                            <h2 className="text-6xl font-light mb-10">{info.title}</h2>
                            <div className="text-xl pb-8">{info.subtitle}</div>
                            <div className="text-lg font-light pb-10">{info.aux}</div>
                            <button className="px-8 py-4 border rounded-full">{info.button}</button>
                        </div>
                    </div>
                </div>
                <div className="h-28 flex items-center justify-center">
                    <div>
                        Stocks & funds offered through Robinhood Financial. Other fees may apply. See our Fee Schedule for more details.
                    </div>
                </div>

            </div>
        </>
    )
}