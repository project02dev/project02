"use client";

import { motion } from "framer-motion";
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
  const steps = [
    {
      title: "Browse or Request Projects",
      description:
        "Explore thousands of ready-made academic projects or request custom work tailored to your specific requirements and deadlines",
      icon: HiSearch,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Advanced search filters",
        "Custom project requests",
        "Department-specific categories",
      ],
    },
    {
      title: "Connect with Expert Creators",
      description:
        "Communicate directly with verified creators to discuss project details, timelines, and customization options",
      icon: HiChat,
      color: "from-green-500 to-emerald-500",
      features: [
        "Secure messaging",
        "Creator portfolios",
        "Real-time notifications",
      ],
    },
    {
      title: "Secure Payment & Protection",
      description:
        "Pay safely through our escrow system with money-back guarantee and quality assurance protection",
      icon: HiLockClosed,
      color: "from-purple-500 to-pink-500",
      features: [
        "Escrow payment system",
        "Money-back guarantee",
        "Secure transactions",
      ],
    },
    {
      title: "Receive & Review Delivery",
      description:
        "Get your completed project with full source files, documentation, and unlimited revisions if needed",
      icon: HiDownload,
      color: "from-orange-500 to-red-500",
      features: ["Source files included", "Documentation", "Revision support"],
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
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-2xl mb-6">
            <HiAcademicCap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-semibold text-sm uppercase tracking-wide">
              Platform Process
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project02
            </span>{" "}
            Works
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From finding the perfect project to successful delivery, our
            platform ensures a seamless and secure experience for both students
            and creators
          </p>
        </motion.div>

        {/* Steps Process */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-100 -translate-x-1/2 z-0" />
              )}

              <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 z-10">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div
                        className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white mb-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-200" />
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For Students Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              For{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Students
              </span>
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Get access to high-quality academic projects that help you excel
              in your studies. Save time, learn from experts, and achieve better
              grades with our curated project marketplace.
            </p>
            <ul className="space-y-4">
              {[
                "Save hundreds of hours on research and development",
                "Learn from professionally crafted projects",
                "Get custom projects tailored to your requirements",
                "24/7 support and revision guarantees",
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <HiStar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 lg:p-12">
              <div className="text-center">
                <HiAcademicCap className="w-24 h-24 text-green-600 mx-auto mb-6" />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Student Benefits
                </h4>
                <p className="text-gray-600">
                  Join thousands of students who have improved their academic
                  performance with Project02
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* For Creators Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div className="lg:order-2">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              For{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Creators
              </span>
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Monetize your expertise by helping students succeed. Build your
              portfolio, earn steady income, and grow your reputation as an
              academic expert.
            </p>
            <ul className="space-y-4">
              {[
                "Earn money from your academic expertise",
                "Build a professional portfolio and reputation",
                "Flexible work on your own schedule",
                "Secure payments and reliable clients",
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <HiUserGroup className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:order-1 relative">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 lg:p-12">
              <div className="text-center">
                <HiUserGroup className="w-24 h-24 text-purple-600 mx-auto mb-6" />
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Creator Opportunities
                </h4>
                <p className="text-gray-600">
                  Join our community of expert creators and start earning from
                  your skills
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12 border border-blue-100">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students and creators already using Project02 to
              achieve academic success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Browse Projects
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                Become a Creator
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
