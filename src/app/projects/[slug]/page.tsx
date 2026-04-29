import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connectDB } from 'lib/mongodb'
import Project from 'models/Project'
import fallbackImage from '../../../assets/images/porcelain-floor-tiles-copy.jpg.jpeg'
import '../../../styles/DetailPages/DetailPages.css'
import FeaturedGrid from '@/Components/FeaturedGrid'
import ServicesCTA from '@/ui/Services/ServicesCTA'

type ProjectDetail = {
    _id: string
    title: string
    description?: string
    image: string
    slug: string
    // actual DB fields
    date?: string
    type?: string
    location?: string
    completionYear?: string
    size?: string
    designStyle?: string
    client?: string
}

type Props = {
    params: Promise<{ slug: string }>
}

async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
    try {
        await connectDB()
        const project = await Project.findOne({ slug }).lean()
        if (!project) return null
        return JSON.parse(JSON.stringify(project))
    } catch (err) {
        console.error('[ProjectDetail] Failed to fetch project', err)
        return null
    }
}

export async function generateStaticParams() {
    try {
        await connectDB()
        const projects = await Project.find({}, { slug: 1 }).lean()
        return projects.map((p: any) => ({ slug: p.slug }))
    } catch {
        return []
    }
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const project = await getProjectBySlug(slug)
    if (!project) return {}

    return {
        title: `${project.title} | RTC Tiling & Waterproofing`,
        description: project.description || `Details about ${project.title}`,
        openGraph: {
            title: project.title,
            description: project.description || `Details about ${project.title}`,
            images: project.image ? [{ url: project.image }] : [],
        },
    }
}

const DETAIL_FIELDS = [
    { key: 'type', label: 'Project Type' },
    { key: 'location', label: 'Location' },
    { key: 'completionYear', label: 'Completion Year' },
    { key: 'size', label: 'Size' },
    { key: 'designStyle', label: 'Design Style' },
    { key: 'client', label: 'Client' },
    { key: 'date', label: 'Date' },
] as const

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params
    const project = await getProjectBySlug(slug)

    if (!project) notFound()

    const hasDetails = DETAIL_FIELDS.some(({ key }) => project[key]?.trim())

    return (
        <div className='detail-main-section'>
            <main className="detail-main">

                <nav className="detail-breadcrumb" aria-label="Breadcrumb">
                    <Link href="/">Home</Link>
                    <span className="detail-breadcrumb-sep">/</span>
                    <Link href="/projects">Projects</Link>
                    <span className="detail-breadcrumb-sep">/</span>
                    <span className="detail-breadcrumb-current">{project.title}</span>
                </nav>

                {/* ── Hero ── */}
                <section className="detail-hero">

                    <div className="detail-img-wrap">
                        <Image
                            src={project.image || fallbackImage}
                            alt={project.title}
                            fill
                            className="detail-img"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <div className="detail-info">
                        <h1 className="detail-title">{project.title}</h1>

                        {project.date && (
                            <p className="detail-meta">{project.date}</p>
                        )}

                        {project.description && (
                            <p className="detail-desc">{project.description}</p>
                        )}

                        {hasDetails && (
                            <div className="detail-table">
                                {DETAIL_FIELDS.map(({ key, label }) =>
                                    project[key] ? (
                                        <div key={key} className="detail-row">
                                            <span className="detail-row-label">{label}</span>
                                            <span className="detail-row-dash">—</span>
                                            <span className="detail-row-value">{project[key]}</span>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section className="project-gallery-in-detail-page">
                    <h1>Project Gallery</h1>
                    <FeaturedGrid />
                </section>
                <ServicesCTA />
            </main>
        </div>

    )
}