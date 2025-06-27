
import React, { useState } from 'react'
import { Plus, Eye, MessageCircle, Calendar, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

export const CustomRequests = () => {
  const requests = [
    {
      id: '1',
      title: 'Machine Learning Prediction Model',
      description: 'Need a Python ML model for stock price prediction using historical data.',
      budget: 200,
      deadline: '2024-02-15',
      status: 'active',
      bids: 8,
      postedDate: '2024-01-20',
      category: 'Machine Learning'
    },
    {
      id: '2',
      title: 'iOS Mobile App Development',
      description: 'Simple todo app with Core Data integration and push notifications.',
      budget: 350,
      deadline: '2024-02-28',
      status: 'in_progress',
      selectedBid: {
        creator: 'ios_dev_expert',
        amount: 320
      },
      postedDate: '2024-01-18',
      category: 'Mobile Development'
    },
    {
      id: '3',
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard using D3.js for sales analytics.',
      budget: 150,
      deadline: '2024-01-30',
      status: 'completed',
      postedDate: '2024-01-10',
      category: 'Data Science',
      rating: 5
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Custom Requests</h1>
            <p className="text-muted-foreground">Manage your custom project requests</p>
          </div>
          <Button asChild>
            <Link to="/custom-request">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{request.title}</CardTitle>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{request.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Budget: ${request.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {request.deadline}</span>
                    </div>
                    <Badge variant="outline">{request.category}</Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">
                    Posted: {request.postedDate}
                  </p>
                  {request.status === 'active' && (
                    <p className="text-lg font-semibold text-primary">
                      {request.bids} bids received
                    </p>
                  )}
                  {request.status === 'in_progress' && request.selectedBid && (
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned to:</p>
                      <p className="font-medium">{request.selectedBid.creator}</p>
                      <p className="text-primary font-semibold">${request.selectedBid.amount}</p>
                    </div>
                  )}
                  {request.status === 'completed' && request.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">Your rating:</span>
                      <div className="flex">
                        {[...Array(request.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/student/custom-requests/${request.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  
                  {request.status === 'active' && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/student/custom-requests/${request.id}/bids`}>
                        View Bids ({request.bids})
                      </Link>
                    </Button>
                  )}
                  
                  {(request.status === 'in_progress' || request.status === 'completed') && request.selectedBid && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/student/messages/${request.selectedBid.creator}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Creator
                      </Link>
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {request.status === 'active' && (
                    <>
                      <Button variant="outline" size="sm">
                        Edit Request
                      </Button>
                      <Button variant="outline" size="sm">
                        Close Request
                      </Button>
                    </>
                  )}
                  
                  {request.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      Request Similar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any custom requests yet.</p>
            <Button asChild>
              <Link to="/custom-request">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Request
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
