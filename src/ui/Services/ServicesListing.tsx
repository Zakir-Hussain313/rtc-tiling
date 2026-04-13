
import Image from 'next/image'
import '../../styles/Services/ServicesListing.css'
import arrow from "../../assets/icons/Arrow.svg";
import image1 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image2 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image3 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image4 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import image5 from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Link from 'next/link';

const services = [
    { image: image1, title: 'WALL TILING', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy.' },
    { image: image2, title: 'SCREEDING', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy.' },
    { image: image3, title: 'SKIRTING', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy.' },
    { image: image4, title: 'WATERPROOF', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy.' },
    { image: image5, title: 'FLOOR TILING', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy.' },
]

export default function ServicesListing() {
    return (
        <main>
            <section className="ServicesListing-main-section">
                {services.map((service, index) => (
                    <div key={index}>
                        <Link href={''} className='services-div'>
                            <div className="services-image">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className='img rounded-[40px] object-cover'
                                />
                            </div>
                            <h1>{service.title}</h1>
                            <p className='services-description'>{service.description}</p>
                            <div className='services-arrow'>
                                <Image
                                    src={arrow}
                                    alt='arrow'
                                    width={27}
                                    height={27}
                                    className=''
                                />
                            </div>
                        </Link>
                        <hr />
                    </div>
                ))}
            </section>
        </main>
    )
}