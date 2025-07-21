import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Package,
  TrendingUp,
  Calendar
} from "lucide-react";

export const MyProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const mockProducts = [
    {
      id: 1,
      name: "iPhone 14 Pro Max 256GB",
      category: "Electronics",
      price: "₦850,000",
      status: "approved",
      views: 124,
      inquiries: 8,
      addedDate: "2024-01-15",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
      condition: "new",
      location: "Lagos"
    },
    {
      id: 2,
      name: "Nike Air Force 1 White",
      category: "Fashion",
      price: "₦45,000",
      status: "pending",
      views: 67,
      inquiries: 3,
      addedDate: "2024-01-14",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      condition: "new",
      location: "Abuja"
    },
    {
      id: 3,
      name: "MacBook Pro M3 16-inch",
      category: "Electronics",
      price: "₦1,200,000",
      status: "approved",
      views: 89,
      inquiries: 12,
      addedDate: "2024-01-13",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop",
      condition: "used-like-new",
      location: "Lagos"
    },
    {
      id: 4,
      name: "Gaming Chair RGB",
      category: "Furniture",
      price: "₦78,000",
      status: "rejected",
      views: 23,
      inquiries: 1,
      addedDate: "2024-01-12",
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&h=300&fit=crop",
      condition: "used-good",
      location: "Port Harcourt",
      rejectionReason: "Images quality too low"
    },
    {
      id: 5,
      name: "Sony WH-1000XM4 Headphones",
      category: "Electronics",
      price: "₦95,000",
      status: "approved",
      views: 156,
      inquiries: 15,
      addedDate: "2024-01-11",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
      condition: "used-like-new",
      location: "Lagos"
    },
    {
      id: 6,
      name: "Samsung Galaxy S24 Ultra",
      category: "Electronics",
      price: "₦750,000",
      status: "draft",
      views: 0,
      inquiries: 0,
      addedDate: "2024-01-10",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop",
      condition: "new",
      location: "Abuja"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { variant: "default" as const, className: "bg-success text-white" },
      pending: { variant: "secondary" as const, className: "bg-warning text-white" },
      rejected: { variant: "destructive" as const, className: "" },
      draft: { variant: "outline" as const, className: "border-muted-foreground" }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getConditionBadge = (condition: string) => {
    const conditionLabels = {
      "new": "New",
      "used-like-new": "Like New",
      "used-good": "Good",
      "used-fair": "Fair"
    };
    return conditionLabels[condition as keyof typeof conditionLabels] || condition;
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === "all" || product.status === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  const getTabCount = (status: string) => {
    if (status === "all") return mockProducts.length;
    return mockProducts.filter(p => p.status === status).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-muted-foreground">
            Manage all your products and track their performance
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Package className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({getTabCount("all")})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({getTabCount("approved")})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({getTabCount("pending")})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({getTabCount("rejected")})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({getTabCount("draft")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No products match your search criteria." : "You haven't added any products yet."}
                </p>
                <Button className="bg-gradient-primary">
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="shadow-card hover:shadow-glow transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge 
                        {...getStatusBadge(product.status)}
                        className={getStatusBadge(product.status).className}
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{product.category}</span>
                          <Badge variant="outline" className="text-xs">
                            {getConditionBadge(product.condition)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{product.price}</span>
                        <span className="text-sm text-muted-foreground">{product.location}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{product.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{product.inquiries} inquiries</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Added {new Date(product.addedDate).toLocaleDateString()}
                      </div>
                      
                      {product.status === "rejected" && product.rejectionReason && (
                        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                          <strong>Rejection reason:</strong> {product.rejectionReason}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};