import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | RTC Projects — Admin Access",
    description: "Secure login portal for RTC Projects admin dashboard.",
    keywords: ["login", "admin", "RTC Projects"],
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Login | RTC Projects",
        description: "Secure login portal for RTC Projects admin dashboard.",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        siteName: "RTC Projects",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Login | RTC Projects",
        description: "Secure login portal for RTC Projects admin dashboard.",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}