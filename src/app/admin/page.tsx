import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    try {
        return {
            title: "Admin | RTC Projects — Dashboard",
            description: "Admin dashboard for managing RTC Projects website content.",
            keywords: ["admin", "dashboard", "RTC Projects"],
            robots: {
                index: false,
                follow: false,
            },
            openGraph: {
                title: "Admin | RTC Projects",
                description: "Admin dashboard for managing RTC Projects website content.",
                url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
                siteName: "RTC Projects",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Admin | RTC Projects",
                description: "Admin dashboard for managing RTC Projects website content.",
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/admin`,
            },
        };
    } catch {
        return {
            title: "Admin | RTC Projects",
            description: "Admin dashboard for managing RTC Projects website content.",
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