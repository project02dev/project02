/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  FiEye,
  FiHeart,
  FiStar,
  FiShare2,
  FiBarChart2,
  FiClipboard,
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Header from "@/components/Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function formatDate(seconds: number) {
  return new Date(seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectAnalyticsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [ratings, setRatings] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // For chart
  const [viewHistory, setViewHistory] = useState<
    { date: string; count: number }[]
  >([]);
  const [likeHistory, setLikeHistory] = useState<
    { date: string; count: number }[]
  >([]);

  useEffect(() => {
    fetchProject();
    fetchRatings();
    fetchAnalytics();
    // eslint-disable-next-line
  }, [projectId]);

  async function fetchProject() {
    setLoading(true);
    try {
      const docRef = doc(db, "projects", projectId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProject({ id: snap.id, ...snap.data() });
        setViews(snap.data().views ?? 0);
        setLikes(snap.data().likes ?? 0);
      }
    } catch (err) {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRatings() {
    const q = query(
      collection(db, "ratings"),
      where("project_Id", "==", projectId)
    );
    const snap = await getDocs(q);
    type Rating = {
      id: string;
      star?: number;
      review?: string;
      rated_by?: string;
      date?: { seconds?: number };
    };
    const list: Rating[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRatings(list);
    setAverageRating(
      list.length
        ? list.reduce((sum, r) => sum + (r.star || 0), 0) / list.length
        : 0
    );
  }

  async function fetchAnalytics() {
    // Example: fetch view/like history from a subcollection or analytics collection
    // Here, we'll mock with random data for demo
    // Replace with your real analytics fetch logic
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    });
    setViewHistory(
      days.map((date, i) => ({
        date,
        count: Math.floor(Math.random() * 20 + 10),
      }))
    );
    setLikeHistory(
      days.map((date, i) => ({
        date,
        count: Math.floor(Math.random() * 10 + 5),
      }))
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/project/${projectId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Sharable Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Share Your Project
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                Copy and share your project link anywhere!
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-700">
                  {`${window.location.origin}/project/${projectId}`}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  <FiClipboard className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiShare2 className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <FiEye className="w-6 h-6 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{views}</div>
              <div className="text-xs text-gray-500">Total Views</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <FiHeart className="w-6 h-6 text-pink-500 mb-2" />
              <div className="text-2xl font-bold">{likes}</div>
              <div className="text-xs text-gray-500">Total Likes</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <FiStar className="w-6 h-6 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">Avg. Rating</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <FiBarChart2 className="w-6 h-6 text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{ratings.length}</div>
              <div className="text-xs text-gray-500">Total Reviews</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">
              Project Performance (Last 7 Days)
            </h3>
            <Line
              data={{
                labels: viewHistory.map((v) => v.date),
                datasets: [
                  {
                    label: "Views",
                    data: viewHistory.map((v) => v.count),
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.1)",
                    tension: 0.4,
                  },
                  {
                    label: "Likes",
                    data: likeHistory.map((l) => l.count),
                    borderColor: "#ec4899",
                    backgroundColor: "rgba(236,72,153,0.1)",
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" as const },
                  title: { display: false },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
              height={220}
            />
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-2">Project Overview</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">{project?.title}</span> has
              received <span className="font-semibold">{views}</span> views,{" "}
              <span className="font-semibold">{likes}</span> likes, and an
              average rating of{" "}
              <span className="font-semibold">{averageRating.toFixed(1)}</span>{" "}
              from <span className="font-semibold">{ratings.length}</span>{" "}
              reviews.
            </p>
            <p className="text-gray-600 text-sm">
              {averageRating >= 4.5
                ? "Your project is performing excellently! 🎉"
                : averageRating >= 3
                ? "Your project is doing well. Keep improving!"
                : "Consider updating your project to improve engagement."}
            </p>
          </div>

          {/* Ratings & Reviews */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Recent Ratings & Reviews</h3>
            {ratings.length === 0 ? (
              <p className="text-gray-500">No ratings yet.</p>
            ) : (
              <div className="space-y-4">
                {ratings.slice(0, 5).map((r) => (
                  <div key={r.id} className="border-b pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.star ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-700">{r.review}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {r.rated_by} •{" "}
                      {r.date?.seconds ? formatDate(r.date.seconds) : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
