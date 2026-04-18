import AboutComponent from "@/ui/About/About";
import type { Metadata } from "next";
import { getAboutImages } from "lib/getAboutImages";

export async function generateMetadata(): Promise<Metadata> {
    try {
        const images = await getAboutImages();
        const firstImage = images?.[0]?.url ?? null;

        return {
            title: "About Us | RTC Tiling — Precision Tile Installation",
            description:
                "Learn about RTC Tiling's story, craftsmanship, and commitment to delivering premium tile installations for homes and businesses.",
            keywords: ["tiling company", "tile installation", "RTC Tiling", "about us", "professional tilers"],
            openGraph: {
                title: "About Us | RTC Tiling",
                description:
                    "Skilled tilers delivering precision and quality across every project — kitchens, bathrooms, floors and more.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
                siteName: "RTC Tiling",
                ...(firstImage && {
                    images: [{ url: firstImage, width: 1200, height: 630, alt: "RTC Tiling About Page" }],
                }),
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "About Us | RTC Tiling",
                description: "Precision tile installation for homes and businesses.",
                ...(firstImage && { images: [firstImage] }),
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
            },
        };
    } catch {
        return {
            title: "About Us | RTC Tiling — Precision Tile Installation",
            description:
                "Learn about RTC Tiling's story, craftsmanship, and commitment to premium tile installations.",
        };
    }
}

export default function About() {
    return (
        <main>
            <AboutComponent />
        </main>
    );
}