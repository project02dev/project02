/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { fetchRatings, addRating } from "@/lib/ratingService";

interface Rating {
  id: string;
  star: number;
  rated_by: string;
  review?: string;
  date?: { seconds: number };
  user_name?: string; // Add user display name
}

export default function ProjectRatings({
  projectId,
  creatorId,
}: {
  projectId: string;
  creatorId: string;
}) {
  const [user] = useAuthState(auth);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [average, setAverage] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedStar, setSelectedStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState<Rating | null>(null);

  useEffect(() => {
    loadRatings();
  }, [projectId, user]);

  const loadRatings = async () => {
    try {
      const r = await fetchRatings(projectId);
      const ratingsWithDefaults = r.map((x: any) => ({
        id: x.id,
        star: x.star ?? 0,
        rated_by: x.rated_by ?? "",
        review: x.review ?? "",
        date: x.date ?? undefined,
        user_name: x.user_name || "Anonymous", // Fallback for user name
      }));

      setRatings(ratingsWithDefaults);

      // Calculate average rating
      if (ratingsWithDefaults.length > 0) {
        const total = ratingsWithDefaults.reduce(
          (sum, x) => sum + (x.star || 0),
          0
        );
        setAverage(total / ratingsWithDefaults.length);
      } else {
        setAverage(0);
      }

      // Check if current user has already rated
      if (user) {
        const existingRating = ratingsWithDefaults.find(
          (r) => r.rated_by === user.uid
        );
        setUserRating(existingRating || null);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const hasRated = !!userRating;
  const canRate = user && user.uid !== creatorId && !hasRated;

  const handleStarClick = (star: number) => {
    setSelectedStar(star);
  };

  const handleStarHover = (star: number) => {
    setHoverStar(star);
  };

  const handleStarLeave = () => {
    setHoverStar(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedStar || user.uid === creatorId) return;

    setSubmitting(true);
    try {
      await addRating({
        project_Id: projectId,
        project_creator_id: creatorId,
        rated_by: user.uid,
        review: reviewText.trim(),
        star: selectedStar,
        user_name: user.displayName || user.email?.split("@")[0] || "Anonymous",
      });

      setReviewText("");
      setSelectedStar(0);
      await loadRatings(); // Reload ratings to reflect the new one
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayStar = hoverStar || selectedStar;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-8">
      <h3 className="text-lg font-bold mb-4">Ratings & Reviews</h3>

      {/* Average Rating Summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-gray-900">
            {average.toFixed(1)}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(average)
                    ? "text-yellow-400 fill-current"
                    : average % 1 > 0.5 && i === Math.floor(average)
                    ? "text-yellow-400 fill-current opacity-70"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {ratings.length} rating{ratings.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Rating Distribution (optional) */}
        <div className="flex-1 text-sm">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratings.filter((r) => r.star === star).length;
            const percentage =
              ratings.length > 0 ? (count / ratings.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="w-4">{star}</span>
                <FiStar className="w-3 h-3 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-xs text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Form */}
      {canRate && (
        <form
          className="mb-6 p-4 bg-gray-50 rounded-lg"
          onSubmit={handleSubmit}
        >
          <h4 className="font-medium mb-3">Rate this project</h4>

          {/* Star Rating Input */}
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => handleStarClick(i + 1)}
                onMouseEnter={() => handleStarHover(i + 1)}
                onMouseLeave={handleStarLeave}
                className={`transition-transform hover:scale-110 ${
                  i < displayStar ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                <FiStar className="w-8 h-8" />
              </button>
            ))}
          </div>

          {/* Selected Rating Display */}
          {selectedStar > 0 && (
            <div className="text-sm text-gray-600 mb-3">
              You selected: {selectedStar} star{selectedStar !== 1 ? "s" : ""}
            </div>
          )}

          {/* Review Textarea */}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this project (optional)"
            className="border rounded p-3 w-full mb-3 text-sm resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 text-right mb-3">
            {reviewText.length}/500
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={submitting || !selectedStar}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </form>
      )}

      {/* User's Existing Rating */}
      {hasRated && userRating && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Your Rating</h4>
          <div className="flex items-center gap-2 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < userRating.star
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-700">{userRating.review}</span>
          </div>
          <div className="text-xs text-gray-500">
            Rated on{" "}
            {userRating.date?.seconds
              ? new Date(userRating.date.seconds * 1000).toLocaleDateString()
              : "Unknown date"}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h4 className="font-medium mb-3">Reviews ({ratings.length})</h4>

        {ratings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No ratings yet. Be the first to rate!
          </p>
        ) : (
          <div className="space-y-4">
            {ratings
              .sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))
              .map((r, idx) => (
                <div
                  key={r.id || idx}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                        {r.user_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{r.user_name}</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3 h-3 ${
                                i < r.star
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {r.date?.seconds
                        ? new Date(r.date.seconds * 1000).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {r.review && (
                    <p className="text-gray-700 text-sm mt-2">{r.review}</p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
