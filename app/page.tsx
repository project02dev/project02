/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/front-pages/HeroSection";
import FeaturedProjects from "@/components/front-pages/FeaturedProjects";
import HowItWorks from "@/components/front-pages/HowItWorks";
import Testimonials from "@/components/front-pages/Testimonials";
import CallToAction from "@/components/front-pages/CallToAction";
import CookieConsent from "@/components/front-pages/CookieConsent";

export const metadata: Metadata = {
  title: "Project02 - Academic Project Marketplace",
  description:
    "Transform how academic projects are created and managed. Connect with talented creators and bring your ideas to life.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Project02 - Academic Project Marketplace",
    description:
      "Fast, user-friendly platform for academic project collaboration",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <FeaturedProjects />
        <HowItWorks />
        <Testimonials />
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
