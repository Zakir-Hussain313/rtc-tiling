import type { Metadata } from "next";
import Home from "../ui/Landing/Home";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "RTC Tiling — Precision Tile Installation",
            description: "RTC Tiling delivers premium tile installations for homes and businesses. Kitchens, bathrooms, floors, pools and more. Get a free quote today.",
            keywords: ["tiling", "tile installation", "RTC Tiling", "kitchen tiling", "bathroom tiling", "floor tiling", "pool tiling", "tiling company"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "RTC Tiling — Precision Tile Installation",
                description: "Premium tile installations for homes and businesses. Kitchens, bathrooms, floors, pools and more. Get a free quote today.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "RTC Tiling — Precision Tile Installation",
                description: "Premium tile installations for homes and businesses. Get a free quote today.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            },
        };
    } catch {
        return {
            title: "RTC Tiling — Precision Tile Installation",
            description: "RTC Tiling delivers premium tile installations for homes and businesses.",
        };
    }
}

export default function Page() {
    return (
        <div className="app-layout">
            <main className="page-content">
                <Home />
            </main>
        </div>
    );
}