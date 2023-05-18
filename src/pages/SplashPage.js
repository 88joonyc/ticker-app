import { ImageBanner } from "../components/imageBanner"
import jsonfile from '../data/splashData.json'

export const SplashPage = function () {
    return (
        <>
            <div>
                {jsonfile.data.map(ele => (
                        <>
                            <ImageBanner data={ele}/>
                        </>
                    ))
                }
            </div>
        </>
    )
}