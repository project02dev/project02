
import React, { useState } from 'react'
import { Search, Filter, Eye, CheckCircle, Ban, Flag, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const ContentModeration = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const pendingProjects = [
    {
      id: '1',
      title: 'Advanced React Dashboard Template',
      creator: 'ui_master',
      submittedDate: '2024-01-20',
      category: 'Web Development',
      price: 149.99,
      description: 'Complete admin dashboard with charts, tables, and user management.',
      status: 'pending_review',
      tags: ['React', 'Dashboard', 'Admin'],
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      title: 'Machine Learning Stock Predictor',
      creator: 'ml_expert',
      submittedDate: '2024-01-19',
      category: 'Data Science',
      price: 199.99,
      description: 'Python ML model for stock price prediction with 85% accuracy.',
      status: 'under_review',
      tags: ['Python', 'ML', 'Finance'],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop'
    }
  ]

  const flaggedContent = [
    {
      id: '1',
      title: 'Suspicious Code Repository',
      creator: 'newuser123',
      reportedBy: 'student456',
      reason: 'Suspected plagiarism',
      reportedDate: '2024-01-21',
      status: 'investigating',
      priority: 'high',
      description: 'User reported this project as copied from GitHub repository.'
    },
    {
      id: '2',
      title: 'Inappropriate Project Content',
      creator: 'creator789',
      reportedBy: 'admin',
      reason: 'Content violation',
      reportedDate: '2024-01-20',
      status: 'resolved',
      priority: 'medium',
      description: 'Project contained inappropriate content, has been removed.'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'under_review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'investigating':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Moderation</h1>
        <p className="text-muted-foreground">Review and moderate platform content</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingProjects.filter(p => p.status === 'pending_review').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pendingProjects.filter(p => p.status === 'under_review').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {flaggedContent.filter(f => f.status === 'investigating').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Projects ({pendingProjects.length})</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content ({flaggedContent.length})</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects Awaiting Review</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pendingProjects.map((project) => (
                  <div key={project.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-lg">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {project.creator} • Submitted {project.submittedDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-lg font-bold text-primary mt-1">
                            ${project.price}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline">{project.category}</Badge>
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Project
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          <Ban className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedContent.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          by {item.creator} • Reported by {item.reportedBy}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority} priority
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-red-600 mb-1">
                        Reason: {item.reason}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Reported: {item.reportedDate}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Investigate
                        </Button>
                        {item.status === 'investigating' && (
                          <>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                            <Button size="sm" variant="outline">
                              <Ban className="h-4 w-4 mr-2" />
                              Take Action
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Review history will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
