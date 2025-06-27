
import React, { useState } from 'react'
import { Search, Filter, MoreVertical, Shield, Ban, CheckCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const users = [
    {
      id: '1',
      username: 'webdev_pro',
      email: 'webdev@example.com',
      fullName: 'John Developer',
      role: 'creator',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-10',
      lastActive: '2024-01-20',
      projectsCount: 5,
      ordersCount: 0,
      totalEarnings: 2847.50,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      username: 'student123',
      email: 'student@example.com',
      fullName: 'Jane Student',
      role: 'student',
      status: 'active',
      isVerified: true,
      joinDate: '2024-01-15',
      lastActive: '2024-01-21',
      projectsCount: 0,
      ordersCount: 8,
      totalSpent: 567.92,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a09e8c?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      username: 'ui_designer',
      email: 'designer@example.com',
      fullName: 'Alex Designer',
      role: 'creator',
      status: 'suspended',
      isVerified: false,
      joinDate: '2024-01-08',
      lastActive: '2024-01-18',
      projectsCount: 3,
      ordersCount: 0,
      totalEarnings: 1234.00,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: '4',
      username: 'data_analyst',
      email: 'analyst@example.com',
      fullName: 'Sarah Analyst',
      role: 'student',
      status: 'pending',
      isVerified: false,
      joinDate: '2024-01-19',
      lastActive: '2024-01-19',
      projectsCount: 0,
      ordersCount: 2,
      totalSpent: 149.98,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'creator':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'student':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'admin':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage platform users and their accounts</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'creator').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'student').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="creator">Creators</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{user.fullName}</h4>
                      {user.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      @{user.username} • {user.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Joined: {user.joinDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last active: {user.lastActive}
                    </p>
                    {user.role === 'creator' ? (
                      <p className="text-sm font-medium text-green-600">
                        ${user.totalEarnings.toFixed(2)} earned
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-blue-600">
                        ${user.totalSpent?.toFixed(2)} spent
                      </p>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      {user.status === 'active' ? (
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate User
                        </DropdownMenuItem>
                      )}
                      {!user.isVerified && (
                        <DropdownMenuItem className="text-blue-600">
                          <Shield className="h-4 w-4 mr-2" />
                          Verify User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
