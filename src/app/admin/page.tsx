import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Admin | RTC Tiling — Dashboard",
            description: "Admin dashboard for managing RTC Tiling website content.",
            keywords: ["admin", "dashboard", "RTC Tiling"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Admin | RTC Tiling",
                description: "Admin dashboard for managing RTC Tiling website content.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
                siteName: "RTC Tiling",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Admin | RTC Tiling",
                description: "Admin dashboard for managing RTC Tiling website content.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin`,
            },
        };
    } catch {
        return {
            title: "Admin | RTC Tiling",
            description: "Admin dashboard for managing RTC Tiling website content.",
        };
    }
}

export default function AdminPage() {
    return (
        <main className="flex justify-center items-center h-screen flex-col gap-5">
            <h1 className="text-3xl md:text-5xl">Welcome to the admin page!</h1>
            <p className="text-xl md:text-2xl text-center">the links to the left will assist you navigate through the pages you can edit in your website</p>
        </main>
    )
}