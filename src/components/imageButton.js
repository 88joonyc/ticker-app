export const ImageButton = function ({image}) {

    
    return (
        <>
            <div className="relative h-full">
                <img className="absolute h-[1000px] object-cover w-full" src={image} />
                <div className="relative h-[1000px] md:p-20 flex flex-col text-5xl md:text-7xl font-light text-white text-center mx-auto md:w-[900px]">
                    <div className="mt-20 md:mt-0">Join a new generation of vigilantes</div>
                    <a href="/signup" className="text-lg px-8 py-2 mx-auto border rounded-full mt-10 bg-black font-bold hover:bg-gray-900">Sign up</a>
                </div>
            </div>
        </>
    )
}