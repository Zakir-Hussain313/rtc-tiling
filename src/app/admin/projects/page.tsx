import type { Metadata } from "next";
import ProjectsEditor from '@/ui/Admin/Projects/ProjectsEditor';

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Projects Editor | RTC Tiling — Admin",
            description: "Edit and manage the Projects section content for RTC Tiling website.",
            keywords: ["admin", "projects editor", "RTC Tiling"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Projects Editor | RTC Tiling",
                description: "Edit and manage the Projects section content for RTC Tiling website.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/projects`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Projects Editor | RTC Tiling",
                description: "Edit and manage the Projects section content for RTC Tiling website.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/projects`,
            },
        };
    } catch {
        return {
            title: "Projects Editor | RTC Tiling — Admin",
            description: "Edit and manage the Projects section content for RTC Tiling website.",
        };
    }
}

export default function ProjectsPage() {
    return <ProjectsEditor />;
}