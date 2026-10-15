import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/db";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "FMP5UN-sVu7_MGtUk-D-dnvc3sAQXhzy-E6Q2pGdm30",
  },
  title: {
    default: "Pakistan Job Hub — Government Jobs Pakistan | Verified Info",
    template: "%s | Pakistan Job Hub",
  },
  description:
    "Poore Pakistan ki verified government jobs. Bina fee, bina sifarish. Roz taaza jobs — akhbar ke ishtihar aur official portals se.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Pakistan Job Hub",
    title: "Pakistan Job Hub — Government Jobs Pakistan",
    description:
      "Poore Pakistan ki verified government jobs. Bina fee, bina sifarish. Roz taaza jobs.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Job Hub — Government Jobs Pakistan",
    description:
      "Poore Pakistan ki verified government jobs. Bina fee, bina sifarish. Roz taaza jobs.",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pakistan Job Hub",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    "Verified government job listings across Pakistan. We do not hire or charge fees.",
  sameAs: ["https://www.facebook.com/profile.php?id=1260981947108810"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pakistan Job Hub",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/jobs?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ur" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
