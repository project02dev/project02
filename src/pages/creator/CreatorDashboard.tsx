
import React from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Package, MessageCircle, Star, TrendingUp, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const CreatorDashboard = () => {
  const recentOrders = [
    {
      id: '1',
      title: 'Vue.js Dashboard Template',
      student: 'student123',
      status: 'in_progress',
      dueDate: '2024-01-15',
      price: 129.99
    },
    {
      id: '2',
      title: 'Mobile App Wireframes',
      student: 'design_student',
      status: 'delivered',
      dueDate: '2024-01-10',
      price: 89.99
    }
  ]

  const myProjects = [
    {
      id: '1',
      title: 'React Authentication System',
      price: 79.99,
      sales: 23,
      views: 1247,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Node.js API Template',
      price: 59.99,
      sales: 15,
      views: 892,
      rating: 4.9
    }
  ]

  const stats = [
    { title: 'Total Earnings', value: '$2,847', icon: DollarSign },
    { title: 'Active Orders', value: '5', icon: Package },
    { title: 'Projects Sold', value: '38', icon: TrendingUp },
    { title: 'Average Rating', value: '4.9', icon: Star }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">Manage your projects and earnings</p>
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
              <div className="text-2xl font-bold text-green-600">{stat.value}</div>
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
                <Link to="/creator/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{order.title}</h4>
                    <p className="text-sm text-muted-foreground">for {order.student}</p>
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
                    <p className="font-medium text-green-600">${order.price}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/creator/orders/${order.id}`}>Manage</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Projects</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/creator/projects/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload New
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProjects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{project.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {project.sales} sales
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {project.views} views
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{project.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">${project.price}</p>
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
            <Link to="/creator/projects/upload">
              <Plus className="h-6 w-6 mb-2" />
              Upload Project
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/creator/custom-requests">
              <Package className="h-6 w-6 mb-2" />
              Custom Requests
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/creator/messages">
              <MessageCircle className="h-6 w-6 mb-2" />
              Messages
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/creator/earnings">
              <DollarSign className="h-6 w-6 mb-2" />
              Earnings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
