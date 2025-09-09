/* eslint-disable @typescript-eslint/prefer-as-const */
import ProjectCard from "@/components/common/ProjectCard";

export default function FeaturedProjects() {
  // This would be replaced with actual data fetching
  const featuredProjects = [
    {
      id: "1",
      title: "Machine Learning Model for Stock Prediction",
      description: "Complete Python project with Jupyter notebooks and dataset",
      price: 49.99,
      department: "Computer Science",
      rating: 4.8,
      creatorName: "Alice Smith",
      creatorId: "101",
      totalSales: 120,
      tags: ["machine learning", "finance", "python"],
      imageUrl: "/images/ml-stock.jpg",
      createdAt: "2024-05-01",
      featured: true,
      difficulty: "advanced" as "advanced",
    },
    {
      id: "2",
      title: "Business Plan for Startup",
      description:
        "Comprehensive 30-page business plan template with financial projections",
      price: 29.99,
      department: "Business",
      rating: 4.5,
      creatorName: "Bob Johnson",
      creatorId: "102",
      totalSales: 85,
      tags: ["business", "startup", "template"],
      imageUrl: "/images/business-plan.jpg",
      createdAt: "2024-04-15",
      featured: true,
      difficulty: "intermediate" as "intermediate",
    },
    {
      id: "3",
      title: "Chemical Reaction Simulation",
      description:
        "Interactive simulation of common chemical reactions with visualization",
      price: 39.99,
      department: "Chemistry",
      rating: 4.7,
      creatorName: "Carol Lee",
      creatorId: "103",
      totalSales: 60,
      tags: ["chemistry", "simulation", "education"],
      imageUrl: "/images/chem-reaction.jpg",
      createdAt: "2024-03-20",
      featured: true,
      difficulty: "beginner" as "beginner",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our hand-picked selection of high-quality academic projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} viewMode={"grid"} />
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/explore"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}
