import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  X, 
  Camera, 
  MapPin, 
  Tag, 
  DollarSign,
  Package,
  Phone,
  Mail
} from "lucide-react";

export const ProductUpload = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    condition: "new",
    location: "",
    contactPhone: "",
    contactEmail: "",
    reasonForSale: "",
    brand: "",
    model: "",
    specifications: ""
  });

  const categories = [
    "Electronics",
    "Fashion & Clothing",
    "Home & Garden",
    "Sports & Fitness",
    "Automotive",
    "Books & Media",
    "Health & Beauty",
    "Toys & Games",
    "Furniture",
    "Art & Collectibles",
    "Other"
  ];

  const locations = [
    "Lagos",
    "Abuja",
    "Port Harcourt",
    "Kano",
    "Ibadan",
    "Benin City",
    "Kaduna",
    "Jos",
    "Enugu",
    "Calabar",
    "Other"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images per product.",
        variant: "destructive"
      });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your product.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Product submitted successfully!",
        description: "Your product has been submitted for review and will be live soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        condition: "new",
        location: "",
        contactPhone: "",
        contactEmail: "",
        reasonForSale: "",
        brand: "",
        model: "",
        specifications: ""
      });
      setImages([]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Add New Product</h1>
        <p className="text-muted-foreground">
          Fill in the details below to add your product to Krystal marketplace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the essential details about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., iPhone 14 Pro Max"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Apple, Samsung, Nike"
                  value={formData.brand}
                  onChange={(e) => updateFormData("brand", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., Pro Max, Galaxy S24"
                  value={formData.model}
                  onChange={(e) => updateFormData("model", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                placeholder="List key specifications, features, or technical details..."
                value={formData.specifications}
                onChange={(e) => updateFormData("specifications", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Condition */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing & Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="250000"
                  value={formData.price}
                  onChange={(e) => updateFormData("price", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => updateFormData("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Condition *</Label>
              <RadioGroup 
                value={formData.condition} 
                onValueChange={(value) => updateFormData("condition", value)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">Brand New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="used-like-new" id="used-like-new" />
                  <Label htmlFor="used-like-new">Used - Like New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="used-good" id="used-good" />
                  <Label htmlFor="used-good">Used - Good</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.condition !== "new" && (
              <div className="space-y-2">
                <Label htmlFor="reasonForSale">Reason for Sale</Label>
                <Textarea
                  id="reasonForSale"
                  placeholder="Why are you selling this item?"
                  value={formData.reasonForSale}
                  onChange={(e) => updateFormData("reasonForSale", e.target.value)}
                  rows={2}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Product Images
            </CardTitle>
            <CardDescription>
              Upload up to 5 high-quality images (PNG, JPG, JPEG)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground text-center">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData("contactPhone", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Address</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData("contactEmail", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-primary"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};