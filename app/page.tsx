import type { Metadata } from "next";
import HeroSection from "@/components/hero-section-2";
import Features from "@/components/features-3";
import Integrations from "@/components/integrations-1";
import Content from "@/components/content-3";
import Pricing from "@/components/pricing-3";
import WhyMimick from "@/components/why-mimick";
import HomeFaq from "@/components/home-faq";
// import CallToAction from "@/components/call-to-action-4";
import Footer from "@/components/footer-5";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mimick.me";

export const metadata: Metadata = {
  title: "AI Portfolio Builder for Freelancers, Creators & Agencies",
  description:
    "MimicK is an AI portfolio builder for freelancers, creators, and agencies to launch high-converting sites with AI chat, lead capture and client-ready analytics.",
  keywords: [
    "AI portfolio builder",
    "freelancer portfolio website",
    "creator portfolio builder",
    "agency portfolio website",
    "AI lead capture portfolio",
  ],
  alternates: {
    canonical: appUrl,
  },
  openGraph: {
    title: "AI Portfolio Builder for Freelancers, Creators & Agencies",
    description:
      "MimicK is an AI portfolio builder for freelancers, creators, and agencies to launch high-converting sites with AI chat, lead capture and client-ready analytics.",
    url: appUrl,
    type: "website",
    images: [
      {
        url: `${appUrl}/image.png`,
        width: 1200,
        height: 630,
        alt: "MimicK AI portfolio builder landing page preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Portfolio Builder for Freelancers, Creators & Agencies",
    description:
      "MimicK is an AI portfolio builder for freelancers, creators, and agencies to launch high-converting sites with AI chat, lead capture and client-ready analytics.",
    images: [`${appUrl}/image.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      {/* <Features /> */}
      {/* <Integrations /> */}
      <Content />
      <WhyMimick />
      <HomeFaq />
      <Pricing />
      {/* <CallToAction /> */}
      <Footer />
    </div>
  );
}
