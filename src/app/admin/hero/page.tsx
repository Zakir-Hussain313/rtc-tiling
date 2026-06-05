import type { Metadata } from "next";
import HeroEditor from "@/ui/Admin/Hero/HeroEditor";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Hero Editor | RTC Projects — Admin",
            description: "Edit and manage the Hero section content for RTC Projects website.",
            keywords: ["admin", "hero editor", "RTC Projects"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Hero Editor | RTC Projects",
                description: "Edit and manage the Hero section content for RTC Projects website.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/hero`,
                siteName: "RTC Projects",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Hero Editor | RTC Projects",
                description: "Edit and manage the Hero section content for RTC Projects website.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/hero`,
            },
        };
    } catch {
        return {
            title: "Hero Editor | RTC Projects — Admin",
            description: "Edit and manage the Hero section content for RTC Projects website.",
        };
    }
}

export default function HeroPage() {
    return <HeroEditor />;
}