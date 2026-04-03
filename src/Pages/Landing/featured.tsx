
import "../../styles/featured.css"
import image1 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image2 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image3 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image4 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image5 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image6 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Image from "next/image"

export default function Featured() {
    return (
        <main className="featured-main-section">
            <section className="title-section">
                <h1>FEATURED</h1>
                <p>Crafted Surfaces, Captured Moments</p>
            </section>
            <section className="image-section">
                <div className="image-div image1">
                    <Image
                        src={image1}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw,
       (max-width: 1024px) 50vw,
       33vw"
                        className="object-cover"
                    />
                </div>

                <div className="image-div image2">
                    <Image
                        src={image2}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw,
       (max-width: 1024px) 50vw,
       33vw"
                        className="object-cover"
                    />
                </div>

                <div className="image-div image3">
                    <Image
                        src={image3}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw,
       (max-width: 1024px) 50vw,
       33vw"
                        className="object-cover"
                    />
                </div>

                <div className="image-div image4">
                    <Image
                        src={image4}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw,
       (max-width: 1024px) 50vw,
       33vw"
                        className="object-cover"
                    />
                </div>

                <div className="image-div image5">
                    <Image
                        src={image5}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw,
       (max-width: 1024px) 50vw,
       33vw"
                        className="object-cover"
                    />
                </div>

                <div className="image-div image6">
                    <Image
                        src={image6}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw,
       (max-width: 1024px) 50vw,
       33vw"
                        className="object-cover"
                    />
                </div>
            </section>
        </main>
    )
}