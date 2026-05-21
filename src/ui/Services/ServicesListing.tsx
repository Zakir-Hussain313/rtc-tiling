import Image from 'next/image'
import '../../styles/Services/ServicesListing.css'
import arrow from "../../assets/icons/Arrow.svg"
import fallbackImage from '../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import Link from 'next/link'
import { connectDB } from 'lib/mongodb'
import Service from 'models/Service'
import FadeIn from '@/Components/FadeIn'
import { optimizeCloudinaryUrl } from 'lib/cloudinaryUtils'
import { unstable_cache } from 'next/cache'

type ServiceDoc = {
    _id: string
    title: string
    description: string
    images: string[]
    slug: string
}

function getTitleSize(title: string): string {
    const longestWord = Math.max(...title.split(' ').map(w => w.length));

    if (longestWord > 14) return '28px';
    if (longestWord > 11) return '34px';
    return '40px';
}

const getServices = unstable_cache(
    async (): Promise<ServiceDoc[]> => {
        try {
            await connectDB()
            const services = await Service.find()
                .sort({ title : 1 })
                .lean()
            return services.map((s: any) => ({
                _id: String(s._id),
                title: s.title,
                description: s.description,
                images: s.images,
                slug: s.slug,
            }))
        } catch (err) {
            console.error('[ServicesListing] Failed to fetch services', err)
            return []
        }
    },
    ['all-services'],
    { revalidate: 60, tags: ['services-data'] }
)

export default async function ServicesListing() {
    const services = await getServices()

    return (
        <main>
            <section className="ServicesListing-main-section">
                {services.map((service, index) => (
                    <FadeIn as="div" key={service._id} delay={index * 100}>
                        <Link href={service.slug} className='services-div'>
                            <div className="services-image">
                                <Image
                                    src={service.images?.[0] ? optimizeCloudinaryUrl(service.images[0], 800) : fallbackImage}
                                    alt={service.title}
                                    fill
                                    className='img rounded-[40px] object-cover'
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={index === 0}
                                />
                            </div>
                            <h1 style={{ '--title-size': getTitleSize(service.title) } as React.CSSProperties}>
                                {service.title}
                            </h1>                            <p className='services-description'>{service.description}</p>
                            <div className='services-arrow'>
                                <Image src={arrow} alt='arrow' width={27} height={27} />
                            </div>
                        </Link>
                        <hr />
                    </FadeIn>
                ))}

                {services.length === 0 && (
                    <p style={{ padding: '2rem', opacity: 0.5 }}>No services available yet.</p>
                )}
            </section>
        </main>
    )
}