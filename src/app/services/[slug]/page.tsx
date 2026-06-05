import { notFound } from 'next/navigation';
import Link from 'next/link';
import '../../../styles/DetailPages/DetailPages.css';
import ServicesCTA from '@/ui/Services/ServicesCTA';
import StoryImageCycler from '@/ui/Landing/StoryImageCycler';
import { unstable_cache } from 'next/cache'
import ServicesGrid from '@/Components/ServicesGrid';
import { connectDB } from '../../../../lib/mongodb';
import Service from '../../../../models/Service';

type Props = {
    params: Promise<{ slug: string }>;
};

type ServiceDoc = {
    _id: string;
    title: string;
    description: string;
    images: string[];
    serviceType: string;
    location: string;
    estimatedDuration: string;
    maximumArea: string;
    finishStyle: string;
    suitableFor: string;
    slug: string;
};

const getService = unstable_cache(
    async (slug: string): Promise<ServiceDoc | null> => {
        try {
            await connectDB()
            const service = await Service.findOne({
                slug: { $in: [slug, `/services/${slug}`] },
            }).lean()
            if (!service) return null
            const s = service as any
            return {
                _id: String(s._id),
                title: s.title,
                description: s.description,
                images: s.images,
                serviceType: s.serviceType,
                location: s.location,
                estimatedDuration: s.estimatedDuration,
                maximumArea: s.maximumArea,
                finishStyle: s.finishStyle,
                suitableFor: s.suitableFor,
                slug: s.slug,
            }
        } catch {
            return null
        }
    },
    ['service-by-slug'],
    { revalidate: 60, tags: ['services-data'] }
)

async function getAllSlugs(): Promise<string[]> {
    try {
        await connectDB();
        const services = await Service.find({}, { slug: 1 }).lean();
        return services.map((s: any) => {
            const slug = s.slug as string;
            return slug.startsWith('/services/') ? slug.replace('/services/', '') : slug;
        });
    } catch {
        return [];
    }
}

export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const service = await getService(slug);

    if (!service) return { title: 'Service Not Found' };

    return {
        title: `${service.title} | RTC Projects & Waterproofing`,
        description: service.description || `Learn more about our ${service.title} service.`,
        openGraph: {
            title: service.title,
            description: service.description,
            images: service.images?.length ? [{ url: service.images[0] }] : [],
        },
    };
}

const DETAIL_FIELDS = [
    { key: 'serviceType', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'estimatedDuration', label: 'Estimated Duration' },
    { key: 'maximumArea', label: 'Maximum Area' },
    { key: 'finishStyle', label: 'Finish & Style' },
    { key: 'suitableFor', label: 'Suitable For' },
] as const;

export default async function ServiceDetailPage({ params }: Props) {
    const { slug } = await params;
    const service = await getService(slug);

    if (!service) notFound();

    const hasDetails = DETAIL_FIELDS.some(
        ({ key }) => service[key] && service[key].trim() !== ''
    );

    return (
        <div className="detail-main-section">
            <main className="detail-main">
                <nav className="detail-breadcrumb" aria-label="Breadcrumb">
                    <Link href="/">Home</Link>
                    <span className="detail-breadcrumb-sep">/</span>
                    <Link href="/services">Services</Link>
                    <span className="detail-breadcrumb-sep">/</span>
                    <span className="detail-breadcrumb-current">{service.title}</span>
                </nav>
                <section className="detail-hero">
                    <div className="detail-img-wrap">
                        <StoryImageCycler images={service.images ?? []} />
                    </div>
                    <div className="detail-info">
                        <h1 className="detail-title">{service.title}</h1>
                        {service.description && (
                            <p className="detail-desc">{service.description}</p>
                        )}
                        {hasDetails && (
                            <div className="detail-table">
                                {DETAIL_FIELDS.map(({ key, label }) =>
                                    service[key] ? (
                                        <div key={key} className="detail-row">
                                            <span className="detail-row-label">{label}</span>
                                            <span className="detail-row-dash">—</span>
                                            <span className="detail-row-value">{service[key]}</span>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>
                </section>
                <section className='project-gallery-in-detail-page'>
                    <h1>Service Gallery</h1>
                    <ServicesGrid images={service.images ?? []} title={service.title} />
                </section>
                <ServicesCTA />
            </main>
        </div>
    );
}