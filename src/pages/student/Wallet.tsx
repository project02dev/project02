
import React, { useState } from 'react'
import { CreditCard, DollarSign, Plus, ArrowUpRight, ArrowDownLeft, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const Wallet = () => {
  const [addFundsAmount, setAddFundsAmount] = useState('')

  const transactions = [
    {
      id: '1',
      type: 'purchase',
      description: 'React E-commerce Website',
      amount: -89.99,
      date: '2024-01-15',
      status: 'completed',
      creator: 'webdev_pro'
    },
    {
      id: '2',
      type: 'deposit',
      description: 'Wallet Top-up',
      amount: 200.00,
      date: '2024-01-14',
      status: 'completed',
      method: 'Credit Card'
    },
    {
      id: '3',
      type: 'purchase',
      description: 'Database Design Project',
      amount: -120.00,
      date: '2024-01-12',
      status: 'completed',
      creator: 'db_expert'
    },
    {
      id: '4',
      type: 'refund',
      description: 'Cancelled Project Refund',
      amount: 45.00,
      date: '2024-01-10',
      status: 'completed'
    }
  ]

  const paymentMethods = [
    {
      id: '1',
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true
    },
    {
      id: '2',
      type: 'credit_card',
      last4: '5555',
      brand: 'Mastercard',
      isDefault: false
    }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case 'deposit':
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'text-red-600'
      case 'deposit':
      case 'refund':
        return 'text-green-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const walletBalance = 156.01

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and payment methods</p>
      </div>

      {/* Wallet Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">${walletBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available for purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,248.50</div>
            <p className="text-xs text-muted-foreground">This month: $209.99</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Projects in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Funds to Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={addFundsAmount}
                      onChange={(e) => setAddFundsAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.brand} **** {method.last4}
                            {method.isDefault && <Badge className="ml-2">Default</Badge>}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">Add Funds</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Payment Methods
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                        {transaction.creator && ` • by ${transaction.creator}`}
                        {transaction.method && ` • ${transaction.method}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4 mt-4">
              {transactions.filter(t => t.type === 'purchase').map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} • by {transaction.creator}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-red-600">
                      -${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="deposits" className="space-y-4 mt-4">
              {transactions.filter(t => t.type === 'deposit' || t.type === 'refund').map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                        {transaction.method && ` • ${transaction.method}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      +${transaction.amount.toFixed(2)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
