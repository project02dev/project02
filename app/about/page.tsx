/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiAward,
  FiGlobe,
  FiHeart,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "About Us - Project02",
  description:
    "Learn about Project02's mission to connect students with academic project creators",
};

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "10,000+", icon: FiUsers },
    { label: "Projects Created", value: "5,000+", icon: FiTrendingUp },
    { label: "Verified Creators", value: "500+", icon: FiAward },
    { label: "Countries", value: "50+", icon: FiGlobe },
  ];

  const features = [
    {
      icon: FiShield,
      title: "Secure Platform",
      description:
        "All transactions are protected with industry-standard security measures and verified creators.",
    },
    {
      icon: FiUsers,
      title: "Quality Community",
      description:
        "Connect with verified academic professionals and talented students from around the world.",
    },
    {
      icon: FiTrendingUp,
      title: "Fair Pricing",
      description:
        "Transparent pricing with competitive commission rates that benefit both creators and students.",
    },
    {
      icon: FiHeart,
      title: "Student-Focused",
      description:
        "Built specifically for academic needs with features designed to enhance learning outcomes.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Empowering Academic Excellence
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Project02 is the premier marketplace connecting students with
                verified academic creators. We're building a community where
                knowledge sharing drives success for everyone.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Join as Student
                </button>
                <button className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                  Become a Creator
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-xl text-gray-600">
                  To democratize access to high-quality academic resources and
                  create opportunities for knowledge creators to share their
                  expertise.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    For Students
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Access a vast library of academic projects, templates, and
                    custom solutions created by verified experts. Learn from
                    real-world examples and accelerate your academic journey.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      Instant access to high-quality projects
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      Custom project requests
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      Direct communication with creators
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    For Creators
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Monetize your academic expertise by creating and selling
                    projects. Build your reputation, help students succeed, and
                    earn income from your knowledge.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      Earn from your expertise
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      Build your professional brand
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      Flexible project creation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Project02?
                </h2>
                <p className="text-xl text-gray-600">
                  We've built the most comprehensive platform for academic
                  project collaboration.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-indigo-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-indigo-100 mb-8">
                Whether you're a student looking for academic resources or an
                expert ready to share your knowledge, Project02 is the perfect
                platform for you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Get Started Today
                </button>
                <button className="px-8 py-3 border border-white text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
