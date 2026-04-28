import type { Metadata } from "next";
import Projects from "@/ui/Projects/Projects";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Projects | RTC Tiling — Our Work",
            description: "Browse RTC Tiling's portfolio of completed tiling projects including kitchens, bathrooms, pools and more. Quality craftsmanship on every job.",
            keywords: ["tiling projects", "tile installation portfolio", "RTC Tiling", "kitchen tiling", "bathroom tiling", "pool tiling"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "Projects | RTC Tiling — Our Work",
                description: "Browse RTC Tiling's portfolio of completed tiling projects. Quality craftsmanship on every job.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/projects`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Projects | RTC Tiling — Our Work",
                description: "Browse RTC Tiling's portfolio of completed tiling projects. Quality craftsmanship on every job.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/projects`,
            },
        };
    } catch {
        return {
            title: "Projects | RTC Tiling — Our Work",
            description: "Browse RTC Tiling's portfolio of completed tiling projects.",
        };
    }
}

export default function ProjectsPage() {
    return (
        <Projects />
    )
}