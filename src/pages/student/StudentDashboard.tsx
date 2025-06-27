
import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ShoppingCart, MessageCircle, Star, Clock, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const StudentDashboard = () => {
  const recentOrders = [
    {
      id: '1',
      title: 'React E-commerce Website',
      creator: 'webdev_pro',
      status: 'in_progress',
      dueDate: '2024-01-15',
      price: 89.99
    },
    {
      id: '2',
      title: 'Database Design Project',
      creator: 'db_expert',
      status: 'delivered',
      dueDate: '2024-01-10',
      price: 59.99
    }
  ]

  const customRequests = [
    {
      id: '1',
      title: 'Machine Learning Model',
      status: 'bidding',
      bids: 5,
      budget: 150,
      deadline: '2024-01-20'
    }
  ]

  const stats = [
    { title: 'Active Orders', value: '3', icon: ShoppingCart },
    { title: 'Completed Projects', value: '12', icon: BookOpen },
    { title: 'Unread Messages', value: '2', icon: MessageCircle },
    { title: 'Average Rating Given', value: '4.8', icon: Star }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">Manage your projects and orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/student/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{order.title}</h4>
                    <p className="text-sm text-muted-foreground">by {order.creator}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Due: {order.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.price}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/student/orders/${order.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Custom Requests</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/student/custom-requests">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{request.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge>{request.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {request.bids} bids
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Budget: ${request.budget}</p>
                      <p className="text-sm text-muted-foreground">Due: {request.deadline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/projects">
              <BookOpen className="h-6 w-6 mb-2" />
              Browse Projects
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/custom-request">
              <Plus className="h-6 w-6 mb-2" />
              Request Custom Project
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/student/messages">
              <MessageCircle className="h-6 w-6 mb-2" />
              Messages
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/student/wallet">
              <ShoppingCart className="h-6 w-6 mb-2" />
              Wallet
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
