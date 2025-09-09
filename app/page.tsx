import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/front-pages/HeroSection";
import FeaturedProjects from "@/components/front-pages/FeaturedProjects";
import HowItWorks from "@/components/front-pages/HowItWorks";
import Testimonials from "@/components/front-pages/Testimonials";
import CallToAction from "@/components/front-pages/CallToAction";

export const metadata: Metadata = {
  title: "Project02 - Academic Project Marketplace",
  description: "Find or create academic projects with Project02",
  icons: {
    icon: "/favicon.png",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <HeroSection />
        <FeaturedProjects />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
