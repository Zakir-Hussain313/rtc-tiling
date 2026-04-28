import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | RTC Tiling — Admin Access",
    description: "Secure login portal for RTC Tiling admin dashboard.",
    keywords: ["login", "admin", "RTC Tiling"],
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Login | RTC Tiling",
        description: "Secure login portal for RTC Tiling admin dashboard.",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        siteName: "RTC Tiling",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Login | RTC Tiling",
        description: "Secure login portal for RTC Tiling admin dashboard.",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}