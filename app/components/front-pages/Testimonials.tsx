/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HiStar,
  HiAcademicCap,
  HiUserGroup,
  HiChartBar,
  HiHeart,
  HiShieldCheck,
  HiLightningBolt,
} from "react-icons/hi";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  createdAt: string;
  type: "student" | "creator";
}

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  website: string;
}

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Mock data - replace with your actual data source
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Student",
      avatar: "",
      quote:
        "Project02 helped me complete my final year project with excellence. The platform connected me with an expert who understood my requirements perfectly.",
      rating: 5,
      createdAt: "2024-01-15",
      type: "student",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Content Creator & Professor",
      avatar: "",
      quote:
        "As a creator, I've earned over $15,000 helping students. The platform provides reliable clients and secure payments. Highly recommended!",
      rating: 5,
      createdAt: "2024-02-20",
      type: "creator",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Business Student",
      avatar: "",
      quote:
        "The quality of projects on Project02 is outstanding. I've used three different projects and each exceeded my expectations.",
      rating: 5,
      createdAt: "2024-03-10",
      type: "student",
    },
    {
      id: 4,
      name: "Alex Thompson",
      role: "Engineering Expert",
      avatar: "",
      quote:
        "I've built a full-time income through Project02. The support team is amazing and the platform keeps improving.",
      rating: 5,
      createdAt: "2024-01-28",
      type: "creator",
    },
  ];

  const partners: Partner[] = [
    {
      id: 1,
      name: "Tech University",
      logo: "",
      description: "Leading technology education institution",
      website: "#",
    },
    {
      id: 2,
      name: "EduTech Solutions",
      logo: "",
      description: "Innovative educational technology provider",
      website: "#",
    },
    {
      id: 3,
      name: "Academic Hub",
      logo: "",
      description: "Comprehensive academic resource platform",
      website: "#",
    },
    {
      id: 4,
      name: "LearnLab",
      logo: "",
      description: "Cutting-edge learning technology company",
      website: "#",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Projects Completed", icon: HiAcademicCap },
    { value: "4.9/5", label: "Satisfaction Rate", icon: HiStar },
    { value: "500+", label: "Expert Creators", icon: HiUserGroup },
    { value: "98%", label: "Success Rate", icon: HiChartBar },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-50 rounded-2xl mb-6">
            <HiHeart className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-semibold text-sm uppercase tracking-wide">
              Community Love
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our growing community of students and creators who are
            transforming academic success through collaboration
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={fadeInUp}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                index === activeTestimonial ? "ring-2 ring-purple-500/20" : ""
              }`}
              onMouseEnter={() => setActiveTestimonial(index)}
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  {testimonial.rating}.0
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(testimonial.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                      }
                    )}
                  </div>
                </div>
                <div
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    testimonial.type === "student"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {testimonial.type === "student" ? "Student" : "Creator"}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cooperation & Partnerships Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-2xl mb-6">
              <HiUserGroup className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm uppercase tracking-wide">
                Strategic Partnerships
              </span>
            </div>

            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Building the Future of{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Education Together
              </span>
            </h3>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We collaborate with leading educational institutions and
              technology partners to enhance the academic experience for
              students worldwide
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HiShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{partner.name}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {partner.description}
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  Learn More →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
