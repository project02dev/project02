"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  HiArrowRight,
  HiPlay,
  HiCheck,
  HiStar,
  HiUsers,
  HiChartBar,
  HiTrash,
} from "react-icons/hi";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscribeDocId, setSubscribeDocId] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check if logged-in user's email is already subscribed
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      checkIfSubscribed(user.email);
    }
  }, [user]);

  // Check if email exists in subscribe collection
  const checkIfSubscribed = async (checkEmail: string) => {
    const q = query(
      collection(db, "subscribe"),
      where("email", "==", checkEmail)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      setSubscribed(true);
      setSubscribeDocId(snap.docs[0].id);
    } else {
      setSubscribed(false);
      setSubscribeDocId(null);
    }
  };

  // Subscribe handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      // Check if already subscribed
      const q = query(collection(db, "subscribe"), where("email", "==", email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSubscribed(true);
        setSubscribeDocId(snap.docs[0].id);
      } else {
        const docRef = await addDoc(collection(db, "subscribe"), {
          email,
          date: serverTimestamp(),
          browser:
            typeof window !== "undefined" ? window.navigator.userAgent : "",
          device_info:
            typeof window !== "undefined" ? window.navigator.platform : "",
        });
        setSubscribed(true);
        setSubscribeDocId(docRef.id);
      }
    } catch (err) {
      console.error("Subscription error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe handler
  const handleUnsubscribe = async () => {
    if (!subscribeDocId) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "subscribe", subscribeDocId));
      setSubscribed(false);
      setSubscribeDocId(null);
    } catch (err) {
      console.error("Unsubscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const stats = [
    {
      value: "75.2%",
      label: "Average daily activity",
      icon: <HiChartBar className="w-5 h-5" />,
    },
    {
      value: "~20k",
      label: "Daily active users",
      icon: <HiUsers className="w-5 h-5" />,
    },
    {
      value: "4.8",
      label: "Average rating",
      icon: <HiStar className="w-5 h-5" />,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <HiCheck className="w-4 h-4" />
                Trusted by 50,000+ students & creators
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Academic Projects
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Made Brilliant
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Fast, user-friendly, and engaging transform how academic
                projects are created and managed. Connect with talented creators
                and bring your ideas to life.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Your Project
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <HiPlay className="w-5 h-5 text-blue-600" />
                Watch Demo
              </button>
            </motion.div>

            {/* Email Input Section */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              {subscribed ? (
                <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-6 text-green-900">
                  <div className="flex-shrink-0">
                    <div className="bg-green-600 rounded-full p-3 flex items-center justify-center">
                      <HiCheck className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">
                      Subscribed successfully!
                    </div>
                    <div className="mb-1">
                      <span className="font-semibold">{email}</span>
                      <span className="text-gray-500 ml-2 text-xs">
                        ({new Date().toLocaleString()})
                      </span>
                    </div>
                    <div className="text-green-700 text-sm mb-2">
                      You&apos;ll receive important updates and news at this
                      email.
                    </div>
                    {user?.email && (
                      <button
                        onClick={handleUnsubscribe}
                        className="flex items-center gap-2 text-red-600 text-xs font-medium hover:underline"
                        disabled={isLoading}
                      >
                        <HiTrash className="w-4 h-4" />
                        Unsubscribe
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4 font-medium">
                    Get all updates from us
                  </p>
                  <form className="flex gap-3" onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={!!user?.email}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading ? "Subscribing..." : "Stay connected"}
                    </button>
                  </form>
                  {user?.email && (
                    <p className="text-xs text-gray-400 mt-2">
                      You&apos;re logged in as{" "}
                      <span className="font-semibold">{user.email}</span>
                    </p>
                  )}
                </>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-6 pt-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 mb-1">
                    {stat.icon}
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div variants={fadeInUp} className="relative">
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                <Image
                  src="/secondary.webp"
                  alt="Project Collaboration Illustration"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Floating Elements */}
                <div className="absolute top-6 left-6 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm"></div>
                <div className="absolute bottom-6 right-6 w-6 h-6 bg-white/30 rounded-full backdrop-blur-sm"></div>
              </div>

              {/* Card Footer */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Project02 Platform
                    </h4>
                    <p className="text-sm text-gray-600">Live demo preview</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <HiStar className="w-4 h-4 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Testimonial Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  SC
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Mr. Muhammed Olayemi
                  </p>
                  <p className="text-xs text-gray-500">Content Creator</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                &apos;Project02 transformed how I collaborate with students.
                Incredible platform!&apos;
              </p>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">20k+</div>
                <div className="text-sm opacity-90">Projects Completed</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
