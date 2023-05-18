export const ImageButton = function ({image}) {

    
    return (
        <>
            <div className="relative h-full">
                <img className="absolute h-[1400px] object-cover w-full" src={image} />
                <div className="relative h-[1400px] p-20 flex flex-col text-8xl text-white text-center mx-auto w-[900px]">
                    <div>Join a new generation of vigilantes</div>
                    <a href="/signup" className="text-lg px-10 py-4 border rounded-full mt-10 bg-black">Sign up</a>
                </div>
            </div>
        </>
    )
}