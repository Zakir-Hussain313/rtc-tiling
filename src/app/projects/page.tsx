import type { Metadata } from "next";
import Projects from "@/ui/Projects/Projects";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Projects | RTC Projects — Our Work",
            description: "Browse RTC Projects's portfolio of completed Projects projects including kitchens, bathrooms, pools and more. Quality craftsmanship on every job.",
            keywords: ["Projects projects", "tile installation portfolio", "RTC Projects", "kitchen Projects", "bathroom Projects", "pool Projects"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "Projects | RTC Projects — Our Work",
                description: "Browse RTC Projects's portfolio of completed Projects projects. Quality craftsmanship on every job.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/projects`,
                siteName: "RTC Projects",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Projects | RTC Projects — Our Work",
                description: "Browse RTC Projects's portfolio of completed Projects projects. Quality craftsmanship on every job.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/projects`,
            },
        };
    } catch {
        return {
            title: "Projects | RTC Projects — Our Work",
            description: "Browse RTC Projects's portfolio of completed Projects projects.",
        };
    }
}

export default function ProjectsPage() {
    return (
        <Projects />
    )
}