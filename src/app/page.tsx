import type { Metadata } from "next";
import Home from "../ui/Landing/Home";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "RTC Projects — Precision Tile Installation",
            description: "RTC Projects delivers premium tile installations for homes and businesses. Kitchens, bathrooms, floors, pools and more. Get a free quote today.",
            keywords: ["Projects", "tile installation", "RTC Projects", "kitchen Projects", "bathroom Projects", "floor Projects", "pool Projects", "Projects company"],
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "RTC Projects — Precision Tile Installation",
                description: "Premium tile installations for homes and businesses. Kitchens, bathrooms, floors, pools and more. Get a free quote today.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}`,
                siteName: "RTC Projects",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "RTC Projects — Precision Tile Installation",
                description: "Premium tile installations for homes and businesses. Get a free quote today.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
            },
        };
    } catch {
        return {
            title: "RTC Projects — Precision Tile Installation",
            description: "RTC Projects delivers premium tile installations for homes and businesses.",
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