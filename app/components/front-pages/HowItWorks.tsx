"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiSearch,
  HiChat,
  HiLockClosed,
  HiDownload,
  HiAcademicCap,
  HiStar,
  HiShieldCheck,
  HiClock,
  HiUserGroup,
} from "react-icons/hi";

export default function HowItWorks() {
  // Redesigned content without numbered badges (1,2,3,4) and aligned to theme
  const phases = [
    {
      title: "Find the Right Project",
      description:
        "Use powerful filters to discover ready-made projects or open a custom request that matches your exact needs.",
      icon: HiSearch,
    },
    {
      title: "Chat and Align",
      description:
        "Discuss scope, timeline, and expectations directly with creators using secure in-app messaging.",
      icon: HiChat,
    },
    {
      title: "Pay Safely",
      description:
        "Funds are held securely until delivery is approved. You’re covered by platform protection.",
      icon: HiLockClosed,
    },
    {
      title: "Receive and Review",
      description:
        "Get files, docs, and revisions if needed. Leave a rating to help the community.",
      icon: HiDownload,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Projects Completed", icon: HiAcademicCap },
    { value: "4.8/5", label: "Average Rating", icon: HiStar },
    { value: "100%", label: "Secure Payments", icon: HiShieldCheck },
    { value: "24/7", label: "Support Available", icon: HiClock },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <HiAcademicCap className="w-4 h-4" />
            How It Works
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, secure, and effective
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A clear process for students and creators to collaborate with
            confidence.
          </p>
        </motion.div>

        {/* Process cards (no numbers) */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16"
        >
          {phases.map((step, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-glass rounded-custom border border-gray-100 p-6 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 primary-green rounded-lg flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats - simplified, theme-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl p-6 lg:p-10 primary-green text-white mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-7 h-7 mx-auto mb-3 opacity-90" />
                <div className="text-2xl lg:text-3xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="opacity-90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Two audience strips - green theme, no gradients */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16"
        >
          <div className="bg-glass rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 primary-green rounded-lg flex items-center justify-center">
                <HiAcademicCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Students</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Learn faster with quality projects and optional custom work
              tailored to your course.
            </p>
            <ul className="space-y-3">
              {[
                "Save time with curated, high-quality work",
                "Optional custom requests for exact needs",
                "Clear timelines and messaging",
                "Protected payments and revisions",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full primary-green inline-block"></span>
                  <span className="text-gray-800">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/explore" className="px-5 py-3 btn-primary text-sm">
                Explore Projects
              </a>
              <a
                href="/signup?role=student"
                className="px-5 py-3 btn-secondary text-sm"
              >
                Start as Student
              </a>
            </div>
          </div>

          <div className="bg-glass rounded-2xl border border-gray-100 p-8 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 primary-green rounded-lg flex items-center justify-center">
                <HiUserGroup className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Creators</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Showcase expertise, earn reliably, and grow a reputation helping
              students succeed.
            </p>
            <ul className="space-y-3">
              {[
                "Steady demand from students",
                "Portfolio growth and ratings",
                "Flexible schedule and scope",
                "Secure escrow payouts",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-2.5 h-2.5 rounded-full primary-green inline-block"></span>
                  <span className="text-gray-800">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/signup?role=creator"
                className="px-5 py-3 btn-primary text-sm"
              >
                Become a Creator
              </a>
              <a></a>
              <Link
                href="/creators"
                className="px-5 py-3 btn-secondary text-sm"
              >
                View Top Creators
              </Link>
            </div>
          </div>
        </motion.div>

        {/* CTA - consistent with theme buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Get started in minutes
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Pick a project or open a request. Collaborate, pay safely, and
              receive quality results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/explore" className="px-8 py-4 btn-primary text-lg">
                Browse Projects
              </a>
              <a
                href="/signup?role=creator"
                className="px-8 py-4 btn-secondary text-lg"
              >
                Become a Creator
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
