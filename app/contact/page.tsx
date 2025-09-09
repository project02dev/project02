"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      type: "general",
    });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions, feedback, or need support? We&apos;re here to
              help! Reach out to our team and we&apos;ll respond as quickly as
              possible.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="creator">Creator Questions</option>
                        <option value="student">Student Support</option>
                        <option value="business">Business Partnership</option>
                        <option value="bug">Bug Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Please provide as much detail as possible..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                    >
                      <FiSend className="w-4 h-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Contact Information
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiMail className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Email Support
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Get help with any questions or issues
                          </p>
                          <a
                            href="mailto:support@project02.com"
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            support@project02.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiMessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Live Chat
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Chat with our support team in real-time
                          </p>
                          <button className="text-green-600 hover:text-green-700">
                            Start Live Chat
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiPhone className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Phone Support
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Monday - Friday, 9 AM - 6 PM EST
                          </p>
                          <a
                            href="tel:+1-555-PROJECT"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            +1 (555) PROJECT
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiMapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Office Location
                          </h3>
                          <p className="text-gray-600">
                            123 Innovation Drive
                            <br />
                            Tech Valley, CA 94000
                            <br />
                            United States
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Times */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Response Times
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">General Inquiries</span>
                        <span className="font-semibold text-indigo-600">
                          24 hours
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Technical Support</span>
                        <span className="font-semibold text-green-600">
                          4-8 hours
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Urgent Issues</span>
                        <span className="font-semibold text-red-600">
                          1-2 hours
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Live Chat</span>
                        <span className="font-semibold text-purple-600">
                          Immediate
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Link */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Looking for Quick Answers?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Check out our FAQ section for instant answers to common
                      questions.
                    </p>
                    <a
                      href="/faq"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Visit FAQ
                    </a>
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
