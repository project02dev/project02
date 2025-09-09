/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import useSWR from "swr";
import { Testimonial } from "@/types/testimonial";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon } from "@heroicons/react/20/solid";
import { QuoteIcon } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Testimonials() {
  const {
    data: testimonials,
    error,
    isLoading,
  } = useSWR<Testimonial[]>("", fetcher);
  const [isImageError, setIsImageError] = useState<Record<number, boolean>>({});

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        Failed to load testimonials. Please try again later.
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => <TestimonialSkeleton key={i} />)
            : testimonials?.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="mb-4 flex justify-between items-start">
                    <QuoteIcon className="h-8 w-8 text-indigo-400" />
                    {testimonial.rating && (
                      <div className="flex">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating!
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 italic mb-6">
                    &ldquo;{testimonial.quote}&quot;
                  </p>

                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                      {!isImageError[testimonial.id] ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                          onError={() =>
                            setIsImageError((prev) => ({
                              ...prev,
                              [testimonial.id]: true,
                            }))
                          }
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <Skeleton className="h-8 w-8" />
      </div>
      <Skeleton className="h-24 w-full mb-6" />
      <div className="flex items-center">
        <Skeleton className="h-12 w-12 rounded-full mr-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
