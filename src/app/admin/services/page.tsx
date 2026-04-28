import type { Metadata } from "next";
import ServicesEditor from "@/ui/Admin/Services/ServicesEditor";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Services Editor | RTC Tiling — Admin",
            description: "Edit and manage the Services section content for RTC Tiling website.",
            keywords: ["admin", "services editor", "RTC Tiling"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Services Editor | RTC Tiling",
                description: "Edit and manage the Services section content for RTC Tiling website.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/services`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Services Editor | RTC Tiling",
                description: "Edit and manage the Services section content for RTC Tiling website.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/services`,
            },
        };
    } catch {
        return {
            title: "Services Editor | RTC Tiling — Admin",
            description: "Edit and manage the Services section content for RTC Tiling website.",
        };
    }
}

export default function ServicesPage() {
    return <ServicesEditor />;
}