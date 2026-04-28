import type { Metadata } from "next";
import Services from "@/ui/Services/Services";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Services | RTC Tiling — What We Offer",
            description: "Explore RTC Tiling's full range of tiling services including kitchen, bathroom, floor, and pool tile installation. Professional results guaranteed.",
            keywords: ["tiling services", "tile installation", "RTC Tiling", "kitchen tiling", "bathroom tiling", "floor tiling", "pool tiling"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "Services | RTC Tiling — What We Offer",
                description: "Explore RTC Tiling's full range of professional tiling services. Quality results on every project.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/services`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Services | RTC Tiling — What We Offer",
                description: "Explore RTC Tiling's full range of professional tiling services. Quality results on every project.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
            },
        };
    } catch {
        return {
            title: "Services | RTC Tiling — What We Offer",
            description: "Explore RTC Tiling's full range of professional tiling services.",
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