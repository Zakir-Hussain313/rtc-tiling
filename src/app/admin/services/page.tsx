import type { Metadata } from "next";
import ServicesEditor from "@/ui/Admin/Services/ServicesEditor";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Services Editor | RTC Projects — Admin",
            description: "Edit and manage the Services section content for RTC Projects website.",
            keywords: ["admin", "services editor", "RTC Projects"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Services Editor | RTC Projects",
                description: "Edit and manage the Services section content for RTC Projects website.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/services`,
                siteName: "RTC Projects",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Services Editor | RTC Projects",
                description: "Edit and manage the Services section content for RTC Projects website.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/services`,
            },
        };
    } catch {
        return {
            title: "Services Editor | RTC Projects — Admin",
            description: "Edit and manage the Services section content for RTC Projects website.",
        };
    }
}

export default function ServicesPage() {
    return <ServicesEditor />;
}