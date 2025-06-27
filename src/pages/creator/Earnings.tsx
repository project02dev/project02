
import React from 'react'
import { DollarSign, TrendingUp, Download, Eye, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Earnings = () => {
  const earningsData = {
    totalEarnings: 2847.50,
    availableBalance: 1923.40,
    pendingBalance: 324.50,
    thisMonth: 589.99,
    lastMonth: 743.20,
    commissionRate: 20
  }

  const recentSales = [
    {
      id: '1',
      projectTitle: 'React Authentication System',
      buyer: 'student123',
      salePrice: 79.99,
      commission: 15.99,
      earnings: 63.99,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: '2',
      projectTitle: 'Node.js API Template',
      buyer: 'developer456',
      salePrice: 59.99,
      commission: 11.99,
      earnings: 47.99,
      date: '2024-01-19',
      status: 'completed'
    },
    {
      id: '3',
      projectTitle: 'React Authentication System',
      buyer: 'coder789',
      salePrice: 79.99,
      commission: 15.99,
      earnings: 63.99,
      date: '2024-01-18',
      status: 'pending'
    }
  ]

  const withdrawalHistory = [
    {
      id: '1',
      amount: 500.00,
      date: '2024-01-15',
      status: 'completed',
      method: 'Bank Transfer'
    },
    {
      id: '2',
      amount: 750.00,
      date: '2024-01-01',
      status: 'completed',
      method: 'PayPal'
    },
    {
      id: '3',
      amount: 300.00,
      date: '2023-12-20',
      status: 'completed',
      method: 'Bank Transfer'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Earnings & Withdrawals</h1>
            <p className="text-muted-foreground">Track your earnings and manage withdrawals</p>
          </div>
          <Button>
            Request Withdrawal
          </Button>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ${earningsData.totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time earnings after commission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${earningsData.availableBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${earningsData.thisMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">
                -${(earningsData.lastMonth - earningsData.thisMonth).toFixed(2)}
              </span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              ${earningsData.pendingBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Processing orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Commission Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Platform Commission</p>
              <p className="text-sm text-muted-foreground">
                PROJECT02 takes a {earningsData.commissionRate}% commission on each sale
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">{earningsData.commissionRate}%</p>
              <p className="text-sm text-muted-foreground">Per sale</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Sales and Withdrawals */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Recent Sales</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal History</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{sale.projectTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        Sold to {sale.buyer} on {sale.date}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(sale.status)}>
                          {sale.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${sale.salePrice}</p>
                      <p className="text-sm text-red-600">-${sale.commission} commission</p>
                      <p className="text-lg font-bold text-green-600">
                        +${sale.earnings}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Withdrawal History</CardTitle>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Download Statement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Withdrawal to {withdrawal.method}</p>
                      <p className="text-sm text-muted-foreground">
                        {withdrawal.date}
                      </p>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${withdrawal.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
