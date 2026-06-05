import type { Metadata } from "next";
import Contact from "@/ui/Contact/Contact";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Contact Us | RTC Projects — Get in Touch",
            description: "Get in touch with RTC Projects for a free consultation. We specialise in precision tile installation for homes and businesses across the area.",
            keywords: ["contact", "RTC Projects", "tile installation", "free consultation", "Projects quote"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "Contact Us | RTC Projects",
                description: "Reach out to RTC Projects today for a free quote on your next Projects project.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
                siteName: "RTC Projects",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Contact Us | RTC Projects",
                description: "Reach out to RTC Projects today for a free quote on your next Projects project.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            },
        };
    } catch {
        return {
            title: "Contact Us | RTC Projects — Get in Touch",
            description: "Get in touch with RTC Projects for a free consultation.",
        };
    }
}

export default function ContactPage() {
    return (
        <Contact />
    )
}