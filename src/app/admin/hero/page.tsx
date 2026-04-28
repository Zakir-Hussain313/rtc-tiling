import type { Metadata } from "next";
import HeroEditor from "@/ui/Admin/Hero/HeroEditor";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Hero Editor | RTC Tiling — Admin",
            description: "Edit and manage the Hero section content for RTC Tiling website.",
            keywords: ["admin", "hero editor", "RTC Tiling"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Hero Editor | RTC Tiling",
                description: "Edit and manage the Hero section content for RTC Tiling website.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/hero`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Hero Editor | RTC Tiling",
                description: "Edit and manage the Hero section content for RTC Tiling website.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/hero`,
            },
        };
    } catch {
        return {
            title: "Hero Editor | RTC Tiling — Admin",
            description: "Edit and manage the Hero section content for RTC Tiling website.",
        };
    }
}

export default function HeroPage() {
    return <HeroEditor />;
}