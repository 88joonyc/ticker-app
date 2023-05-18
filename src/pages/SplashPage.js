import { ImageBanner } from "../components/imageBanner"
import { Footer } from "../components/footer"
import jsonfile from '../data/splashData.json'
import { ImageButton } from "../components/imageButton"


export const SplashPage = function () {
    return (
        <>
            <div>
                {jsonfile.splash.data.map(ele => (
                        <>
                            <ImageBanner data={ele}/>
                        </>
                    ))
                }
                <ImageButton image={jsonfile.footer.image} />
                <Footer />
            </div>
        </>
    )
}