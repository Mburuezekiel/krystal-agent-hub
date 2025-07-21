import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Star, Calendar } from "lucide-react";

interface ProfileProps {
  userData: { name: string; email: string; role: string };
}

export const Profile = ({ userData }: ProfileProps) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: "+234 xxx xxx xxxx",
    location: "Lagos",
    bio: "Experienced agent specializing in electronics and fashion items."
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Agent Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{userData.name}</h3>
            <p className="text-muted-foreground">{userData.email}</p>
            <Badge className="mt-2 bg-gradient-secondary">
              Verified Agent
            </Badge>
            
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={formData.email}
                      className="pl-9"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-primary">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};