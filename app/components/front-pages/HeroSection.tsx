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

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      checkIfSubscribed(user.email);
    }
  }, [user]);

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-72 sm:h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-96 sm:h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 relative z-10">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Left Content */}
          <div className="w-full space-y-8">
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <HiCheck className="w-4 h-4" />
                Trusted by 50,000+ students & creators
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Academic Projects
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Made Brilliant
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
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
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 btn-primary font-semibold text-base sm:text-lg transition-all duration-300"
              >
                Start Your Project
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 btn-secondary font-semibold text-base sm:text-lg transition-all duration-300">
                <HiPlay className="w-5 h-5 text-blue-600" />
                Watch Demo
              </button>
            </motion.div>

            {/* Email Input Section */}
            <motion.div
              variants={fadeInUp}
              className="bg-glass rounded-custom p-4 sm:p-6 border border-gray-100"
            >
              {subscribed ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-green-50 border border-green-200 rounded-custom p-4 sm:p-6 text-green-900">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="primary-green rounded-full p-3 flex items-center justify-center">
                      <HiCheck className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-base sm:text-lg mb-1">
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
                  <p className="text-gray-600 mb-4 font-medium text-sm sm:text-base">
                    Get all updates from us
                  </p>
                  <form
                    className="flex flex-col sm:flex-row gap-3"
                    onSubmit={handleSubscribe}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom focus-green text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={!!user?.email}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 btn-primary transition-colors disabled:opacity-50 text-sm"
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
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    {stat.icon}
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div variants={fadeInUp} className="relative w-full">
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden w-full max-w-lg mx-auto">
              <div className="aspect-video primary-green relative overflow-hidden">
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
              <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Project02 Platform
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Live demo preview
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <HiStar className="w-4 h-4 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Testimonial Card */}
            <div className="absolute -bottom-6 left-0 sm:-left-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 max-w-xs w-5/6 sm:w-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 primary-green rounded-full flex items-center justify-center text-white font-bold">
                  SC
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Mr. Muhammed Olayemi
                  </p>
                  <p className="text-xs text-gray-500">Content Creator</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 italic">
                &apos;Project02 transformed how I collaborate with students.
                Incredible platform!&apos;
              </p>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -top-6 right-0 sm:-right-6 primary-green text-white rounded-custom p-3 sm:p-4 w-32 text-center">
              <div className="text-xl sm:text-2xl font-bold">20k+</div>
              <div className="text-xs sm:text-sm opacity-90">
                Projects Completed
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
