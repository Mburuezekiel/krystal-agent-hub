import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Package, Calendar, DollarSign, Eye, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { getUserOrders, Order } from '@/services/ordersService';
import { useAuth } from '@/context/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const { isOnline, wasOffline } = useNetworkStatus();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await getUserOrders();
      setOrders(userOrders);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      if (!isOnline) {
        setError('You are offline. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to load orders. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isOnline && wasOffline && error) {
      fetchOrders();
    }
  }, [isOnline, wasOffline, error]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="text-gray-600 mb-6">You need to log in to view your orders.</p>
        <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white">
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#D81E05]">My Orders</h1>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-[#D81E05]" />
          <p className="mt-4 text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#D81E05]">My Orders</h1>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          {!isOnline ? (
            <WifiOff className="h-12 w-12 text-gray-500" />
          ) : (
            <AlertCircle className="h-12 w-12 text-red-500" />
          )}
          <p className="mt-4 text-lg text-gray-700 text-center">{error}</p>
          {isOnline && (
            <Button onClick={fetchOrders} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white">
              Retry
            </Button>
          )}
          {!isOnline && (
            <p className="text-gray-500 text-sm mt-4">Will automatically retry when connection is restored.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-[#F8F8F8]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#D81E05]">My Orders</h1>
          <p className="text-gray-600">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white">
                <Link to="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold text-[#222222]">
                        Order #{order.orderNumber || order._id.slice(-8)}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                              <p className="text-gray-600">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-gray-500 text-sm">
                            + {order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
                        {order.shippingAddress && (
                          <p><span className="font-medium">Shipping to:</span> {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/orders/${order._id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;