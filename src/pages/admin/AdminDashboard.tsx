
import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Package, DollarSign, AlertTriangle, TrendingUp, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const AdminDashboard = () => {
  const pendingItems = [
    {
      id: '1',
      type: 'project',
      title: 'React Components Library',
      creator: 'ui_designer',
      status: 'pending_approval'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 450.00,
      creator: 'dev_master',
      status: 'pending'
    }
  ]

  const recentReports = [
    {
      id: '1',
      type: 'Content Violation',
      reported_by: 'student123',
      target: 'Project: Plagiarized Code',
      status: 'investigating'
    },
    {
      id: '2',
      type: 'Payment Dispute',
      reported_by: 'creator456',
      target: 'Order #12345',
      status: 'resolved'
    }
  ]

  const stats = [
    { title: 'Total Users', value: '15,482', icon: Users, change: '+12%' },
    { title: 'Active Projects', value: '3,247', icon: Package, change: '+8%' },
    { title: 'Monthly Revenue', value: '$42,850', icon: DollarSign, change: '+15%' },
    { title: 'Pending Reports', value: '23', icon: AlertTriangle, change: '-5%' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
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
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                {' '}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/approvals">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {item.type === 'project' ? item.title : `Withdrawal Request`}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.type === 'project' ? `by ${item.creator}` : `$${item.amount} by ${item.creator}`}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/${item.type}s/${item.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/reports">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{report.type}</h4>
                    <Badge variant={report.status === 'resolved' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Reported by: {report.reported_by}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Target: {report.target}
                  </p>
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
            <Link to="/admin/users">
              <Users className="h-6 w-6 mb-2" />
              Manage Users
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/admin/projects">
              <Package className="h-6 w-6 mb-2" />
              Content Moderation
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/admin/financial">
              <DollarSign className="h-6 w-6 mb-2" />
              Financial Overview
            </Link>
          </Button>
          <Button variant="outline" className="h-20 flex-col" asChild>
            <Link to="/admin/analytics">
              <TrendingUp className="h-6 w-6 mb-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
