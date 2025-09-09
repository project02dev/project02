/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const results = {
      timestamp: new Date().toISOString(),
      actions: [] as any[],
    };

    // Check if projects collection exists and has data
    try {
      const existingProjects = await projectService.getProjects({ limit: 1 });

      if (existingProjects.length === 0) {
        // Create some sample projects to ensure the collection exists
        const sampleProjects = [
          {
            title: "Machine Learning Stock Prediction",
            description:
              "Complete Python ML model with Jupyter notebooks, dataset, and comprehensive documentation. Includes data preprocessing, feature engineering, and model evaluation.",
            department: "Computer Science",
            price: 89.99,
            difficulty: "advanced" as const,
            tags: ["Python", "Machine Learning", "Data Science", "Jupyter"],
            category: "ready-made" as const,
            creatorId: "sample-creator-1",
            creatorName: "Dr. Sarah Chen",
            status: "active",
            featured: true,
            deliverables: [
              "Source code",
              "Jupyter notebooks",
              "Dataset",
              "Documentation",
            ],
            githubRepo: "https://github.com/sample/ml-stock-prediction",
            previewDescription:
              "Advanced machine learning model for stock price prediction using historical data and technical indicators.",
            requirements: "Python 3.8+, Jupyter, pandas, scikit-learn",
            estimatedTime: "4-6 hours",
            thumbnailUrl: "/images/projects/ml-stock.svg",
            projectFiles: [],
          },
          {
            title: "Business Plan Template",
            description:
              "30-page business plan template with financial projections, market analysis, and executive summary. Perfect for startup ventures and business courses.",
            department: "Business Administration",
            price: 45.0,
            difficulty: "intermediate" as const,
            tags: ["Business Plan", "Startup", "Finance", "Marketing"],
            category: "ready-made" as const,
            creatorId: "sample-creator-2",
            creatorName: "Prof. Michael Johnson",
            status: "active",
            featured: false,
            deliverables: [
              "Business plan template",
              "Financial spreadsheets",
              "Market analysis guide",
            ],
            githubRepo: "",
            previewDescription:
              "Comprehensive business plan template with all essential sections for startup success.",
            requirements: "Microsoft Office or Google Workspace",
            estimatedTime: "2-3 hours",
            thumbnailUrl: "/images/projects/business-plan.svg",
            projectFiles: [],
          },
          {
            title: "React E-commerce Website",
            description:
              "Full-stack e-commerce application built with React, Node.js, and MongoDB. Includes user authentication, payment integration, and admin dashboard.",
            department: "Computer Science",
            price: 125.0,
            difficulty: "advanced" as const,
            tags: ["React", "Node.js", "MongoDB", "E-commerce"],
            category: "ready-made" as const,
            creatorId: "sample-creator-3",
            creatorName: "Alex Rodriguez",
            status: "active",
            featured: true,
            deliverables: [
              "Complete source code",
              "Database schema",
              "Deployment guide",
              "API documentation",
            ],
            githubRepo: "https://github.com/sample/react-ecommerce",
            previewDescription:
              "Modern e-commerce platform with all essential features for online retail.",
            requirements: "Node.js 16+, MongoDB, React knowledge",
            estimatedTime: "8-10 hours",
            thumbnailUrl: "/images/projects/react-ecommerce.svg",
            projectFiles: [],
          },
        ];

        for (const project of sampleProjects) {
          try {
            const result = await projectService.createProject(project);
            results.actions.push({
              action: "Create Sample Project",
              status: "success",
              projectTitle: project.title,
              projectId: result.id,
            });
          } catch (error) {
            results.actions.push({
              action: "Create Sample Project",
              status: "error",
              projectTitle: project.title,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }
      } else {
        results.actions.push({
          action: "Check Projects Collection",
          status: "exists",
          result: `Found ${existingProjects.length} existing projects`,
        });
      }
    } catch (error) {
      results.actions.push({
        action: "Initialize Projects Collection",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database initialization completed",
      results,
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database initialization failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
