import type { Metadata } from "next";
import Contact from "@/ui/Contact/Contact";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Contact Us | RTC Tiling — Get in Touch",
            description: "Get in touch with RTC Tiling for a free consultation. We specialise in precision tile installation for homes and businesses across the area.",
            keywords: ["contact", "RTC Tiling", "tile installation", "free consultation", "tiling quote"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "Contact Us | RTC Tiling",
                description: "Reach out to RTC Tiling today for a free quote on your next tiling project.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Contact Us | RTC Tiling",
                description: "Reach out to RTC Tiling today for a free quote on your next tiling project.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            },
        };
    } catch {
        return {
            title: "Contact Us | RTC Tiling — Get in Touch",
            description: "Get in touch with RTC Tiling for a free consultation.",
        };
    }
}

export default function ContactPage() {
    return (
        <Contact />
    )
}