import React from 'react';
import { Package, DollarSign, TrendingUp, Eye, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const AgentDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalProducts: 45,
    approvedProducts: 38,
    pendingProducts: 7,
    totalSales: 12750,
    thisMonthSales: 3240,
    salesGrowth: 8.5,
    totalViews: 2340,
    conversionRate: 12.5,
  };

  const recentProducts = [
    { id: 1, name: 'iPhone 15 Pro', status: 'approved', price: 999, views: 234, sales: 12 },
    { id: 2, name: 'MacBook Air M2', status: 'pending', price: 1199, views: 0, sales: 0 },
    { id: 3, name: 'AirPods Pro', status: 'approved', price: 249, views: 156, sales: 8 },
    { id: 4, name: 'iPad Pro', status: 'rejected', price: 799, views: 45, sales: 0 },
  ];

  const recentActivities = [
    { id: 1, message: 'iPhone 15 Pro received 5 new views', time: '10 minutes ago' },
    { id: 2, message: 'MacBook Air M2 submitted for approval', time: '2 hours ago' },
    { id: 3, message: 'AirPods Pro sold to customer', time: '4 hours ago' },
    { id: 4, message: 'Product photos updated for iPad Pro', time: '1 day ago' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-600">Track your products, sales, and performance metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-xs text-green-600">{stats.approvedProducts} approved</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{stats.salesGrowth}% this month
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Product Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-600">This month</p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                <p className="text-xs text-green-600">Above average</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{product.name}</p>
                      {getStatusBadge(product.status)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-gray-500">${product.price}</p>
                      <p className="text-xs text-gray-500">{product.views} views</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors">
              <Package className="w-6 h-6 text-red-600 mb-2" />
              <p className="font-medium text-red-800">Add New Product</p>
              <p className="text-sm text-red-600">List a new item for sale</p>
            </button>
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-blue-800">View Analytics</p>
              <p className="text-sm text-blue-600">Check detailed performance</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <DollarSign className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-green-800">Check Earnings</p>
              <p className="text-sm text-green-600">View your sales revenue</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboard;