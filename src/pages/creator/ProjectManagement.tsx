
import React, { useState } from 'react'
import { Plus, Edit, Eye, Trash2, Star, Download, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link } from 'react-router-dom'

export const ProjectManagement = () => {
  const projects = [
    {
      id: '1',
      title: 'React Authentication System',
      description: 'Complete authentication system with JWT, password reset, and email verification.',
      price: 79.99,
      status: 'published',
      sales: 23,
      views: 1247,
      rating: 4.8,
      totalRatings: 15,
      createdDate: '2024-01-10',
      lastUpdate: '2024-01-15',
      category: 'Web Development',
      tags: ['React', 'JWT', 'Authentication'],
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Node.js API Template',
      description: 'RESTful API template with Express, MongoDB, and comprehensive documentation.',
      price: 59.99,
      status: 'published',
      sales: 15,
      views: 892,
      rating: 4.9,
      totalRatings: 12,
      createdDate: '2024-01-05',
      lastUpdate: '2024-01-12',
      category: 'Backend Development',
      tags: ['Node.js', 'Express', 'MongoDB'],
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      title: 'Python Data Analysis Dashboard',
      description: 'Interactive dashboard for data visualization using Plotly and Streamlit.',
      price: 89.99,
      status: 'draft',
      sales: 0,
      views: 0,
      createdDate: '2024-01-18',
      lastUpdate: '2024-01-20',
      category: 'Data Science',
      tags: ['Python', 'Plotly', 'Streamlit'],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'under_review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const publishedProjects = projects.filter(p => p.status === 'published')
  const draftProjects = projects.filter(p => p.status === 'draft')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Project Management</h1>
            <p className="text-muted-foreground">Manage your project listings and sales</p>
          </div>
          <Button asChild>
            <Link to="/creator/projects/upload">
              <Plus className="h-4 w-4 mr-2" />
              Upload New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {projects.reduce((sum, p) => sum + p.sales, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedProjects.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${project.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Created: {project.createdDate}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{project.sales} sales</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{project.views} views</span>
                    </div>
                    {project.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{project.rating} ({project.totalRatings} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/creator/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/projects/${project.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/creator/projects/${project.id}/analytics`}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {project.status === 'draft' && (
                      <Button size="sm">
                        Publish Project
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="published" className="space-y-6">
          {publishedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <p className="text-muted-foreground mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{project.sales} sales</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{project.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{project.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${project.price}</p>
                    <p className="text-sm text-green-600 font-medium">
                      ${(project.price * project.sales * 0.8).toFixed(2)} earned
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          {draftProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <p className="text-muted-foreground mb-2">
                        {project.description}
                      </p>
                      <Badge className={getStatusColor(project.status)}>
                        Draft
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-muted-foreground">${project.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {project.lastUpdate}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button size="sm" asChild>
                    <Link to={`/creator/projects/${project.id}/edit`}>
                      Continue Editing
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Publish Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
