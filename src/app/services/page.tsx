import type { Metadata } from "next";
import Services from "@/ui/Services/Services";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Services | RTC Projects — What We Offer",
            description: "Explore RTC Projects's full range of Projects services including kitchen, bathroom, floor, and pool tile installation. Professional results guaranteed.",
            keywords: ["Projects services", "tile installation", "RTC Projects", "kitchen Projects", "bathroom Projects", "floor Projects", "pool Projects"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "Services | RTC Projects — What We Offer",
                description: "Explore RTC Projects's full range of professional Projects services. Quality results on every project.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/services`,
                siteName: "RTC Projects",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Services | RTC Projects — What We Offer",
                description: "Explore RTC Projects's full range of professional Projects services. Quality results on every project.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
            },
        };
    } catch {
        return {
            title: "Services | RTC Projects — What We Offer",
            description: "Explore RTC Projects's full range of professional Projects services.",
        };
    }
}

export default function ServicesPage() {
    return (
        <main>
            <Services />
        </main>
    )
}