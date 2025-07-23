import React from 'react';
import { Users, Package, DollarSign, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const AdminDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1247,
    totalAgents: 89,
    pendingAgents: 12,
    totalProducts: 3456,
    pendingProducts: 23,
    totalRevenue: 125000,
    thisMonthRevenue: 23500,
    revenueGrowth: 12.5,
  };

  const recentActivities = [
    { id: 1, type: 'agent_request', message: 'John Doe requested agent approval', time: '2 minutes ago' },
    { id: 2, type: 'product_pending', message: 'New product "iPhone 15" pending approval', time: '5 minutes ago' },
    { id: 3, type: 'user_registered', message: 'Sarah Wilson registered as new user', time: '10 minutes ago' },
    { id: 4, type: 'agent_approved', message: 'Mike Johnson approved as agent', time: '15 minutes ago' },
  ];

  const pendingApprovals = [
    { id: 1, type: 'agent', name: 'Alice Cooper', email: 'alice@example.com', date: '2024-01-15' },
    { id: 2, type: 'product', name: 'MacBook Pro M3', category: 'Electronics', date: '2024-01-15' },
    { id: 3, type: 'agent', name: 'Bob Smith', email: 'bob@example.com', date: '2024-01-14' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening on Krystal Traders.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
                <p className="text-xs text-orange-600">{stats.pendingAgents} pending approval</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
                <p className="text-xs text-orange-600">{stats.pendingProducts} pending approval</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{stats.revenueGrowth}% this month
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Badge variant="destructive">{pendingApprovals.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.type === 'agent' ? item.email : item.category} • {item.date}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.type === 'agent' ? 'default' : 'secondary'}>
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;