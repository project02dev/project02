"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "students" | "creators" | "payments";
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqs: FAQItem[] = [
    {
      question: "What is Project02?",
      answer:
        "Project02 is an academic marketplace that connects students with verified project creators. Students can browse and purchase high-quality academic projects, while creators can monetize their expertise by selling their work.",
      category: "general",
    },
    {
      question: "How do I get started as a student?",
      answer:
        "Simply sign up for a free account, browse our project catalog, and purchase projects that match your academic needs. You can filter by department, difficulty level, and price to find exactly what you're looking for.",
      category: "students",
    },
    {
      question: "How do I become a creator?",
      answer:
        "Sign up for an account and upgrade to a creator profile. Once verified, you can start uploading projects, set your prices, and earn money from your academic expertise. We provide tools to help you create compelling project listings.",
      category: "creators",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our encrypted payment system. You'll receive instant access to your purchased projects.",
      category: "payments",
    },
    {
      question: "Are the projects original and plagiarism-free?",
      answer:
        "Yes! All projects are created by verified creators and go through our quality review process. We have strict policies against plagiarism and ensure all content is original. Each project comes with a guarantee of authenticity.",
      category: "general",
    },
    {
      question: "Can I request custom projects?",
      answer:
        "Absolutely! Many of our creators offer custom project services. You can browse custom project listings or contact creators directly to discuss your specific requirements and timeline.",
      category: "students",
    },
    {
      question: "How much can I earn as a creator?",
      answer:
        "Creator earnings vary based on project quality, pricing, and demand. Our top creators earn thousands of dollars per month. We take a small commission (15%) and you keep the rest. There's no limit to how much you can earn.",
      category: "creators",
    },
    {
      question: "What if I'm not satisfied with a project?",
      answer:
        "We offer a 7-day satisfaction guarantee. If you're not happy with your purchase, contact our support team and we'll work with the creator to resolve the issue or provide a full refund.",
      category: "students",
    },
    {
      question: "How do I get paid as a creator?",
      answer:
        "Payments are processed weekly via PayPal or bank transfer. You can track your earnings in real-time through your creator dashboard. Minimum payout is $50.",
      category: "creators",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we take security seriously. All personal and payment information is encrypted and stored securely. We never share your information with third parties without your consent.",
      category: "general",
    },
  ];

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "students", label: "For Students" },
    { id: "creators", label: "For Creators" },
    { id: "payments", label: "Payments" },
  ];

  const filteredFAQs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about Project02. Can&apos;t find
              what you&apos;re looking for? Contact our support team for
              personalized help.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeCategory === category.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      {openItems.includes(index) ? (
                        <FiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>

                    {openItems.includes(index) && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="mt-16 text-center">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Still have questions?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Our support team is here to help you succeed. Get in touch
                    and we&apos;ll respond within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      Contact Support
                    </button>
                    <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
