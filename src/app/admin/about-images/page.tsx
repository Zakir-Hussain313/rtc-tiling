import type { Metadata } from "next";
import AboutEditor from "@/ui/Admin/AboutImages/AboutEditor";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "About Editor | RTC Tiling — Admin",
            description: "Edit and manage the About page images and content for RTC Tiling website.",
            keywords: ["admin", "about editor", "RTC Tiling"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "About Editor | RTC Tiling",
                description: "Edit and manage the About page images and content for RTC Tiling website.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/about`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "About Editor | RTC Tiling",
                description: "Edit and manage the About page images and content for RTC Tiling website.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/about`,
            },
        };
    } catch {
        return {
            title: "About Editor | RTC Tiling — Admin",
            description: "Edit and manage the About page images and content for RTC Tiling website.",
        };
    }
}

export default function AboutPage() {
    return <AboutEditor />;
}