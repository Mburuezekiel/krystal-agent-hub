import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp, 
  Eye,
  Plus,
  Star
} from "lucide-react";

interface DashboardHomeProps {
  onPageChange: (page: string) => void;
}

export const DashboardHome = ({ onPageChange }: DashboardHomeProps) => {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      description: "Products added this month",
      icon: Package,
      color: "bg-gradient-primary",
      change: "+12%"
    },
    {
      title: "Approved",
      value: "18",
      description: "Successfully approved",
      icon: CheckCircle,
      color: "bg-gradient-secondary",
      change: "+8%"
    },
    {
      title: "Pending",
      value: "4",
      description: "Awaiting approval",
      icon: Clock,
      color: "bg-gradient-accent",
      change: "-2%"
    },
    {
      title: "Views",
      value: "1,247",
      description: "Total product views",
      icon: Eye,
      color: "bg-gradient-primary",
      change: "+24%"
    }
  ];

  const recentProducts = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      category: "Electronics",
      price: "KES 105,000",
      status: "approved",
      views: 124,
      addedDate: "2025-05-15"
    },
    {
      id: 2,
      name: "Nike Air Force 1",
      category: "Fashion",
      price: "KES 45,000",
      status: "pending",
      views: 67,
      addedDate: "2025-04-14"
    },
    {
      id: 3,
      name: "MacBook Pro M3",
      category: "Electronics",
      price: "KES 120,000",
      status: "approved",
      views: 89,
      addedDate: "2025-03-13"
    },
    {
      id: 4,
      name: "Gaming Chair",
      category: "Furniture",
      price: "KES 8,000",
      status: "rejected",
      views: 23,
      addedDate: "2025-02-12"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { variant: "default" as const, className: "bg-success text-white" },
      pending: { variant: "secondary" as const, className: "bg-warning text-white" },
      rejected: { variant: "destructive" as const, className: "" }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Agent!</h1>
        <p className="text-white/80 mb-4">
          Ready to add more amazing products to Krystal? Your dashboard overview is below.
        </p>
        <Button 
          onClick={() => onPageChange("add-product")}
          className="bg-white text-primary hover:bg-white/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span className="text-sm text-success">{stat.change}</span>
                  <span className="text-sm text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Products */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>
                Your latest product submissions and their status
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onPageChange("my-products")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium">{product.name}</h3>
                    <Badge 
                      {...getStatusBadge(product.status)}
                      className={getStatusBadge(product.status).className}
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span>{product.price}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {product.views} views
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {new Date(product.addedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card cursor-pointer hover:shadow-glow transition-shadow" 
              onClick={() => onPageChange("add-product")}>
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-primary p-4 rounded-lg w-fit mx-auto mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Add Product</h3>
            <p className="text-sm text-muted-foreground">
              Upload new products to the platform
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card cursor-pointer hover:shadow-glow transition-shadow"
              onClick={() => onPageChange("my-products")}>
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-secondary p-4 rounded-lg w-fit mx-auto mb-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Manage Products</h3>
            <p className="text-sm text-muted-foreground">
              View and edit your products
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card cursor-pointer hover:shadow-glow transition-shadow"
              onClick={() => onPageChange("profile")}>
          <CardContent className="p-6 text-center">
            <div className="bg-gradient-accent p-4 rounded-lg w-fit mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Agent Profile</h3>
            <p className="text-sm text-muted-foreground">
              Update your profile information
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};