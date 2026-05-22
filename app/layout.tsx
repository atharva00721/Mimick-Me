import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Instrument_Serif, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { productFaqs, publicPricingTiers, softwareFeatureList } from "@/lib/structured-data";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mimick.me";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MimicK",
  url: appUrl,
  logo: `${appUrl}/android-chrome-512x512.png`,
  sameAs: [
    "https://x.com/mimickme",
    "https://www.linkedin.com/company/mimickme",
    "https://www.instagram.com/mimickme",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: appUrl,
  name: "MimicK",
  potentialAction: {
    "@type": "SearchAction",
    target: `${appUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MimicK",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: publicPricingTiers.map((tier) => ({
    "@type": "Offer",
    name: tier.name,
    price: tier.price,
    priceCurrency: "USD",
    description: tier.description,
  })),
  featureList: [...softwareFeatureList],
};

const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: productFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "MimicK",
    template: "%s | MimicK",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} ${figtree.variable} antialiased`}>
        <Script id="organization-jsonld" type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </Script>
        <Script id="website-jsonld" type="application/ld+json">
          {JSON.stringify(webSiteJsonLd)}
        </Script>
        <Script id="software-application-jsonld" type="application/ld+json">
          {JSON.stringify(softwareApplicationJsonLd)}
        </Script>
        <Script id="faqpage-jsonld" type="application/ld+json">
          {JSON.stringify(faqPageJsonLd)}
        </Script>
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
