
import React, { useState } from 'react'
import { Download, Eye, MessageCircle, Star, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link } from 'react-router-dom'

export const OrderHistory = () => {
  const orders = [
    {
      id: '1',
      title: 'React E-commerce Website',
      creator: 'webdev_pro',
      status: 'completed',
      orderDate: '2024-01-15',
      deliveryDate: '2024-01-18',
      price: 89.99,
      type: 'ready-made',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      rating: 5,
      hasFiles: true
    },
    {
      id: '2',
      title: 'Database Design Project',
      creator: 'db_expert',
      status: 'in_progress',
      orderDate: '2024-01-20',
      dueDate: '2024-01-25',
      price: 120.00,
      type: 'custom',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
      hasFiles: false
    },
    {
      id: '3',
      title: 'Mobile App UI Design',
      creator: 'ui_designer',
      status: 'delivered',
      orderDate: '2024-01-12',
      deliveryDate: '2024-01-16',
      price: 79.99,
      type: 'ready-made',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&h=100&fit=crop',
      hasFiles: true
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'delivered':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const activeOrders = orders.filter(order => order.status === 'in_progress' || order.status === 'delivered')
  const completedOrders = orders.filter(order => order.status === 'completed')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">Track your project orders and downloads</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.thumbnail}
                      alt={order.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{order.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {order.creator}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {order.type}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ')}
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${order.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Ordered: {order.orderDate}
                    </p>
                    {order.deliveryDate && (
                      <p className="text-sm text-muted-foreground">
                        Delivered: {order.deliveryDate}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {order.hasFiles && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Files
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/student/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/student/messages/${order.creator}`}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Creator
                      </Link>
                    </Button>
                  </div>
                  {order.status === 'completed' && order.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Your rating:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(order.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.thumbnail}
                      alt={order.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{order.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {order.creator}</p>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ')}
                        </div>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${order.price}</p>
                    {order.dueDate && (
                      <p className="text-sm text-muted-foreground">
                        Due: {order.dueDate}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/student/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Track Progress
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/student/messages/${order.creator}`}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Creator
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.thumbnail}
                      alt={order.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">{order.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {order.creator}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {order.rating && [...Array(order.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${order.price}</p>
                    <p className="text-sm text-muted-foreground">
                      Completed: {order.deliveryDate}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Again
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/student/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Reorder
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
