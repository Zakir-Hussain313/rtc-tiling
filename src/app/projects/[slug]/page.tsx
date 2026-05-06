import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connectDB } from 'lib/mongodb'
import Project from 'models/Project'
import ProjectHeroImage from '@/Components/ProjectHeroImage'
import '../../../styles/DetailPages/DetailPages.css'
import FeaturedGrid from '@/Components/FeaturedGrid'
import ServicesCTA from '@/ui/Services/ServicesCTA'
import { unstable_cache } from 'next/cache'
import { getFeaturedProjects } from 'lib/getFeaturedProjects'

type ProjectDetail = {
    _id: string
    title: string
    description?: string
    images: string[]
    slug: string
    date?: string
    type?: string
    location?: string
    size?: string
    designStyle?: string
    client?: string
}

type Props = {
    params: Promise<{ slug: string }>
}

const getProjectBySlug = unstable_cache(
    async (slug: string): Promise<ProjectDetail | null> => {
        try {
            await connectDB()
            const project = await Project.findOne({ slug }).lean()
            if (!project) return null
            const p = project as any
            return {
                _id: String(p._id),
                title: p.title,
                description: p.description,
                images: p.images,
                slug: p.slug,
                date: p.date,
                type: p.type,
                location: p.location,
                size: p.size,
                designStyle: p.designStyle,
                client: p.client,
            }
        } catch (err) {
            console.error('[ProjectDetail] Failed to fetch project', err)
            return null
        }
    },
    ['project-by-slug'],
    { revalidate: 60, tags: ['projects-data'] }
)

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
            images: project.images?.[0] ? [{ url: project.images[0] }] : [],
        },
    }
}

const DETAIL_FIELDS = [
    { key: 'type', label: 'Project Type' },
    { key: 'location', label: 'Location' },
    { key: 'size', label: 'Size' },
    { key: 'designStyle', label: 'Design Style' },
    { key: 'client', label: 'Client' },
    { key: 'date', label: 'Date' },
] as const

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params
    const [project, featuredProjects] = await Promise.all([
        getProjectBySlug(slug),
        getFeaturedProjects(),
    ])

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

                <section className="detail-hero">
                    <div className="detail-img-wrap">
                        <ProjectHeroImage images={project.images} title={project.title} />
                    </div>
                    <div className="detail-info">
                        <h1 className="detail-title">{project.title}</h1>
                        {project.date && (
                            <p className="detail-meta">
                                {new Date(project.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                            </p>
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
                                            <span className="detail-row-value">
                                                {key === 'date'
                                                    ? new Date(project[key] ?? '').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                                                    : project[key]}
                                            </span>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        )}
                    </div>
                </section>

                <section className="project-gallery-in-detail-page">
                    <h1>Project Gallery</h1>
                    <FeaturedGrid projects={featuredProjects} />
                </section>
                <ServicesCTA />
            </main>
        </div>
    )
}