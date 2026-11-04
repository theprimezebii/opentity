import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import { GlobalToast } from "@/components/ui/GlobalToast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = localFont({
  src: [{ path: "./fonts/Geist-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [{ path: "./fonts/GeistMono-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: `${APP_NAME} — Discover Global Tech Events`, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  keywords: ["hackathons", "tech events", "AI competitions", "coding challenges", "developer conferences", "Pakistan tech", "global hackathons"],
  authors: [{ name: "Opentity Team" }],
  creator: "Opentity",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    title: `${APP_NAME} — Discover Global Tech Events`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [{ url: `${APP_URL}/logos/logo-full-transparent.png`, width: 1200, height: 630, alt: APP_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Discover Global Tech Events`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/logos/logo-full-transparent.png`],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: APP_NAME,
  url: APP_URL,
  logo: `${APP_URL}/logos/logo-full-transparent.png`,
  description: APP_DESCRIPTION,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  url: APP_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${APP_URL}/events?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning className="notranslate">
      <head>
        <meta name="google" content="notranslate" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <GlobalToast />
        </ThemeProvider>
      </body>
    </html>
  );
}
