"use client";

import Link from "next/link";
import {
  HiArrowRight,
  HiAcademicCap,
  HiUserGroup,
  HiStar,
  HiShieldCheck,
  HiLightningBolt,
} from "react-icons/hi";

export default function CallToAction() {
  const features = [
    {
      icon: HiAcademicCap,
      text: "Access 10,000+ Projects",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: HiUserGroup,
      text: "Join 500+ Expert Creators",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: HiStar,
      text: "4.9/5 Satisfaction Rate",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: HiShieldCheck,
      text: "Secure Payment Protection",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 border border-white/30 text-white font-semibold text-sm uppercase tracking-wide">
          <HiLightningBolt className="w-5 h-5" />
          Join Today - Start Tomorrow
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight text-center">
          Ready to Transform Your{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
            Academic Journey?
          </span>
        </h2>

        {/* Description */}
        <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed text-center">
          Join{" "}
          <span className="font-semibold text-white">10,000+ students</span> and{" "}
          <span className="font-semibold text-white">500+ expert creators</span>{" "}
          who are already achieving academic excellence through Project02.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium text-sm">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Link
            href="/signup?role=student"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <HiAcademicCap className="w-6 h-6" />
            Start as Student
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/signup?role=creator"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            <HiUserGroup className="w-6 h-6" />
            Become a Creator
            <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-blue-600"
                ></div>
              ))}
            </div>
            <span className="text-sm font-medium">
              Join 500+ new users this week
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/30"></div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <HiStar
                  key={i}
                  className="w-4 h-4 text-yellow-300 fill-current"
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              Rated 4.9/5 by our community
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">0%</div>
              <div className="text-blue-200 text-sm">
                Platform Fees for Students
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">30min</div>
              <div className="text-blue-200 text-sm">
                Average Project Match Time
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-blue-200 text-sm">Support Available</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex justify-center">
          <div className="text-blue-200 text-sm font-medium flex items-center gap-2">
            <span>No credit card required</span>
            <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
            <span>Free to join</span>
            <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
            <span>Instant access</span>
          </div>
        </div>
      </div>
    </section>
  );
}
