import type { Metadata } from "next";
import StatsEditor from '@/ui/Admin/Stats/StatsEditor';

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Stats Editor | RTC Tiling — Admin",
            description: "Edit and manage the Stats section content for RTC Tiling website.",
            keywords: ["admin", "stats editor", "RTC Tiling"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Stats Editor | RTC Tiling",
                description: "Edit and manage the Stats section content for RTC Tiling website.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/stats`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Stats Editor | RTC Tiling",
                description: "Edit and manage the Stats section content for RTC Tiling website.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/stats`,
            },
        };
    } catch {
        return {
            title: "Stats Editor | RTC Tiling — Admin",
            description: "Edit and manage the Stats section content for RTC Tiling website.",
        };
    }
}

export default function StatsPage() {
    return <StatsEditor />;
}