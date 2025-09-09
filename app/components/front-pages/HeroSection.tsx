"use client";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 pt-20 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Academic{" "}
              <span className="inline-flex items-center -space-x-3 align-middle">
                <Image
                  src="/hero-user.png"
                  alt="Student"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white"
                />
              </span>{" "}
              Projects <br />
              Made Easy with{" "}
              <span className="text-indigo-600 inline-block">Project02</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Connect with talented creators and bring your academic projects to
              life. Join the leading platform trusted by students and content
              creators.
            </p>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Your Project <HiArrowRight className="ml-1" />
            </Link>

            {/* Testimonial Card */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6 max-w-md border border-gray-100">
              <p className="text-gray-700 mb-4 italic">
                &quot;Project02 transformed how I collaborate with students. The
                platform makes project management seamless and efficient.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/avatars/testimonial1.png"
                    alt="Dr. Sarah Chen"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dr. Sarah Chen</p>
                  <p className="text-sm text-gray-500">
                    Content Creator & Educator
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual with blob shape */}
          <div className="flex-1 relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-[3rem] blur-2xl opacity-60" />
            <div className="relative overflow-hidden shadow-2xl custom-blob">
              <video
                src="/hero1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                poster="/images/collaboration-poster.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom clip-path shape */}
      <style jsx>{`
        .custom-blob {
          clip-path: polygon(
            15% 0%,
            85% 0%,
            100% 15%,
            100% 85%,
            85% 100%,
            15% 100%,
            0% 85%,
            0% 15%
          );
          border-radius: 2rem;
        }
      `}</style>
    </section>
  );
}
