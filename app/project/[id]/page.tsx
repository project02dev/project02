/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ProjectRatings from "@/components/project/ProjectRatings";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import {
  projectService,
  reviewService,
  analyticsService,
} from "@/lib/database";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentForm from "@/components/PaymentForm";
import PaymentModal from "@/components/payment/PaymentModal";
import { LargeLikeButton } from "@/components/common/LikeButton";
import Image from "next/image";
import {
  FiStar,
  FiUser,
  FiCalendar,
  FiDownload,
  FiEye,
  FiShoppingBag,
  FiMessageCircle,
  FiShare2,
  FiHeart,
  FiFileText,
  FiGithub,
  FiClock,
  FiAward,
  FiX,
} from "react-icons/fi";

interface Project {
  totalLikes: number;
  id: string;
  title: string;
  description: string;
  price: number;
  department: string;
  creatorName: string;
  creatorId: string;
  rating: number;
  totalSales: number;
  tags: string[];
  thumbnailUrl?: string;
  previewUrl?: string;
  githubRepo?: string;
  createdAt: string;
  updatedAt?: string;
  featured: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  deliverables: string[];
  requirements?: string;
  estimatedTime?: string;
  category: "ready-made" | "custom";
  reviews: Review[];
  currency?: string;
  status?: string;
  totalPurchases?: number;
  totalViews?: number;
  purchasedBy?: string[];
  likedBy?: string[];
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string);
    }
  }, [params.id]);

  const fetchProject = async (projectId: string) => {
    try {
      setProjectLoading(true);
      // Fetch project from Firebase
      const projectData = await projectService.getProject(projectId);

      if (projectData) {
        // Fetch reviews for this project
        const projectReviews = await reviewService.getProjectReviews(projectId);

        // Type assertion to ensure projectData has the expected shape
        const typedProjectData = projectData as Project;

        // Convert Firestore timestamps to strings
        const formattedProject = {
          ...typedProjectData,
          createdAt:
            typedProjectData.createdAt?.toString?.() ||
            typedProjectData.createdAt,
          updatedAt:
            (typedProjectData as any).updatedAt?.toString?.() ||
            (typedProjectData as any).updatedAt,
        };

        const formattedReviews = projectReviews.map((review: any) => ({
          ...review,
          createdAt:
            review.createdAt && typeof review.createdAt.toDate === "function"
              ? review.createdAt.toDate().toISOString()
              : review.createdAt || "",
        }));

        setProject({ ...formattedProject, reviews: formattedReviews });
        setReviews(formattedReviews);

        // Track page view and project view
        if (user) {
          analyticsService.trackPageView(user.uid, `/project/${projectId}`);
          if (formattedProject.creatorId) {
            analyticsService.trackProjectView(
              user.uid,
              projectId,
              formattedProject.creatorId
            );
          }
        }
      } else {
        // If no project found, create a sample project for demo
        const sampleProject: Project = {
          id: projectId,
          title: "Machine Learning Stock Prediction Model",
          description: `This comprehensive machine learning project provides a complete solution for stock price prediction using Python and popular ML libraries. The project includes data preprocessing, feature engineering, model training, and evaluation components.

The model uses historical stock data, technical indicators, and market sentiment analysis to predict future stock prices. It's built with scikit-learn, pandas, and matplotlib for visualization.

Perfect for students learning machine learning, data science, or financial modeling. The code is well-documented and includes step-by-step explanations of the methodology.`,
          price: 89.99,
          department: "Computer Science",
          creatorName: "Dr. Sarah Chen",
          creatorId: "sample-creator",
          rating: 4.8,
          totalSales: 156,
          tags: [
            "Python",
            "Machine Learning",
            "Data Science",
            "Jupyter",
            "Finance",
            "Scikit-learn",
          ],
          thumbnailUrl: "/images/projects/ml-stock.svg",
          previewUrl: "/previews/ml-stock-preview.pdf",
          githubRepo: "https://github.com/sarahchen/ml-stock-prediction",
          createdAt: new Date().toISOString(),
          featured: true,
          difficulty: "advanced",
          deliverables: [
            "Complete Python source code",
            "Jupyter notebook with explanations",
            "Sample dataset (CSV files)",
            "Requirements.txt file",
            "Comprehensive documentation",
            "Model evaluation report",
            "Installation guide",
          ],
          requirements:
            "Basic knowledge of Python and machine learning concepts recommended",
          estimatedTime: "2-3 hours to understand and implement",
          category: "ready-made",
          reviews: [],
          totalLikes: 0,
        };
        setProject(sampleProject);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setProjectLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (orderId: string) => {
    setShowPaymentModal(false);
    setIsPurchasing(false);

    // Track purchase
    if (user && project) {
      analyticsService.trackPurchase(user.uid, project.id, project.price);
    }

    // Redirect to dashboard to see purchase
    router.push("/dashboard?tab=purchases");
  };

  const handlePaymentError = (error: string) => {
    setIsPurchasing(false);
    alert(`Payment failed: ${error}`);
  };

  const handleContactCreator = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!project?.creatorId) {
      alert("Creator information not available");
      return;
    }

    // Prevent users from messaging themselves
    if (project.creatorId === user.uid) {
      alert("You cannot message yourself!");
      return;
    }

    // Navigate to messages page with the creator's ID
    router.push(`/messages?user=${project.creatorId}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title,
          text: project?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-amber-100 text-amber-800";
      case "advanced":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        aria-hidden="true"
      />
    ));
  };

  if (loading || projectLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
            <p>Loading project...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The project you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/explore")}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Browse Projects
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Project Header */}
              <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {project.title}
                      </h1>
                      {project.featured && (
                        <span className="px-2 sm:px-3 py-1 bg-indigo-600 text-white rounded-full text-xs sm:text-sm font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <FiUser className="w-4 h-4 text-green-700" />
                        <span>{project.creatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4 text-green-700" />
                        <span>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {project.department}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          project.difficulty
                        )}`}
                      >
                        {project.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(project.rating)}
                        <span className="ml-2 font-medium">
                          {project.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                          ({project.reviews.length} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <FiShoppingBag className="w-4 h-4 text-green-700" />
                        <span>{project.totalSales} sales</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full border ${
                        isLiked
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                      aria-pressed={isLiked}
                      aria-label="Like project"
                    >
                      <FiHeart
                        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                      aria-label="Share project"
                    >
                      <FiShare2 className="w-5 h-5 text-green-700" />
                    </button>
                  </div>
                </div>
                {/* Project Image */}
                <div className="relative h-56 sm:h-72 bg-gray-200 rounded-xl overflow-hidden mb-4 sm:mb-6">
                  {project.thumbnailUrl ? (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiFileText className="w-12 sm:w-16 h-12 sm:h-16" />
                    </div>
                  )}
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-green-50 text-green-800 rounded-full text-xs sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow border border-gray-100">
                <div className="border-b border-gray-100 overflow-x-auto">
                  <nav className="flex space-x-4 sm:space-x-8 px-2 sm:px-6">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "deliverables", label: "What's Included" },
                      {
                        id: "reviews",
                        label: `Reviews (${project.reviews.length})`,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                          activeTab === tab.id
                            ? "border-green-600 text-green-700"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="p-4 sm:p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Description
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                          {project.description
                            .split("\n")
                            .map((paragraph, index) => (
                              <p key={index} className="mb-4">
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </div>

                      {project.requirements && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Requirements
                          </h3>
                          <p className="text-gray-700">
                            {project.requirements}
                          </p>
                        </div>
                      )}

                      {project.estimatedTime && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Estimated Time
                          </h3>
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiClock className="w-4 h-4" />
                            <span>{project.estimatedTime}</span>
                          </div>
                        </div>
                      )}

                      {project.githubRepo && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Source Code
                          </h3>
                          <a
                            href={project.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                          >
                            <FiGithub className="w-4 h-4" />
                            View on GitHub
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "deliverables" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        What You'll Get
                      </h3>
                      <div className="space-y-3">
                        {project.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            <span className="text-gray-700">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      {project.reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No reviews yet
                        </p>
                      ) : (
                        project.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-gray-200 pb-6 last:border-b-0"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">
                                    {review.userName}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-100 sticky top-4">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(project.price)}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-base">
                    One-time purchase
                  </p>
                </div>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <FiShoppingBag className="w-5 h-5" />
                    {isPurchasing ? "Processing..." : "Buy Now"}
                  </button>
                  {project.previewUrl && (
                    <a
                      href={project.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 btn-secondary"
                    >
                      <FiEye className="w-5 h-5 text-green-700" />
                      Preview
                    </a>
                  )}
                  {user && project?.creatorId !== user.uid && (
                    <button
                      onClick={handleContactCreator}
                      className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 btn-secondary"
                    >
                      <FiMessageCircle className="w-5 h-5 text-green-700" />
                      Contact Creator
                    </button>
                  )}
                  <div className="flex justify-center">
                    <LargeLikeButton
                      projectId={project.id}
                      initialLiked={isLiked}
                      initialCount={project.totalLikes || 0}
                    />
                  </div>
                </div>
                {/* Creator Info */}
                <div className="border-t pt-4 sm:pt-6">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3">
                    About the Creator
                  </h4>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 primary-green rounded-full flex items-center justify-center text-white font-semibold">
                      {project.creatorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {project.creatorName}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {project.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiAward className="w-4 h-4 text-green-700" />
                      <span>Verified Creator</span>
                    </div>
                  </div>
                </div>
                {/* Quick Stats */}
                <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3">
                    Project Stats
                  </h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sales</span>
                      <span className="font-medium">{project.totalSales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium">{project.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium capitalize">
                        {project.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                </div>
                <ProjectRatings
                  projectId={project.id}
                  creatorId={project.creatorId}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Modal */}
      {showPayment && project && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Purchase
                </h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <PaymentForm
                projectId={project.id}
                amount={project.price}
                projectTitle={project.title}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </div>
      )}

      {/* New Payment Modal */}
      {project && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          project={{
            ...project,
            currency: project.currency ?? "USD",
            totalRevenue: (project as any).totalRevenue ?? 0,
            averageRating:
              (project as any).averageRating ?? project.rating ?? 0,
            totalReviews:
              (project as any).totalReviews ?? project.reviews?.length ?? 0,
            requirements: Array.isArray(project.requirements)
              ? project.requirements
              : project.requirements
              ? [project.requirements]
              : undefined,
            status:
              project.status === "draft" ||
              project.status === "published" ||
              project.status === "suspended" ||
              project.status === "deleted"
                ? project.status
                : "published",
            totalPurchases: project.totalPurchases ?? 0,
            totalViews: project.totalViews ?? 0,
            createdAt:
              typeof project.createdAt === "string"
                ? new Date(project.createdAt)
                : project.createdAt,
            updatedAt:
              typeof project.updatedAt === "string"
                ? new Date(project.updatedAt)
                : project.updatedAt ?? new Date(),
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
