// src/pages/ProfilePage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, Package, Heart, LogOut, MapPin, Edit } from 'lucide-react'; // Added icons

// Zod schema for profile editing
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Dummy data for orders (in a real app, this would come from an API)
const dummyOrders = [
  { id: 'ORD001', date: '2024-07-15', total: 12500, status: 'Delivered', items: 3 },
  { id: 'ORD002', date: '2024-07-20', total: 8500, status: 'Processing', items: 2 },
  { id: 'ORD003', date: '2024-07-22', total: 3200, status: 'Shipped', items: 1 },
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');
  const [userEmail, setUserEmail] = React.useState('');
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Load user data from localStorage on mount
  React.useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail'); // Assuming email is also stored
    if (storedUserName) {
      setUserName(storedUserName);
      // Set default form values for editing
      reset({
        firstName: storedUserName.split(' ')[0] || '', // Simple split for mock first name
        lastName: storedUserName.split(' ')[1] || '',  // Simple split for mock last name
        email: storedUserEmail || '',
      });
    } else {
      // If no user data, redirect to login
      navigate('/login');
    }
  }, [navigate, reset]); // Add reset to dependency array for effect to run when reset is available

  const handleProfileUpdate = (data: ProfileFormValues) => {
    console.log("Updating Profile:", data);
    // In a real app, you'd send this to your backend API
    // If successful, update localStorage and local state
    localStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
    localStorage.setItem('userEmail', data.email);
    setUserName(`${data.firstName} ${data.lastName}`);
    setUserEmail(data.email);
    setIsEditingProfile(false); // Exit editing mode
    alert("Profile updated successfully!"); // Replace with toast/modal
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail'); // Clear email too
    navigate('/login');
  };

  return (
    <>
      
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#D81E05]">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#222222]">Account Navigation</h2>
            <nav className="flex flex-col gap-3">
              <Button variant="ghost" className="justify-start text-lg font-medium text-[#D81E05] hover:bg-gray-100 hover:text-[#D81E05]">
                <UserCircle className="mr-3 h-5 w-5" /> Profile Overview
              </Button>
              <Button variant="ghost" asChild className="justify-start text-lg font-medium text-[#222222] hover:bg-gray-100 hover:text-[#D81E05]">
                <Link to="/orders">
                  <Package className="mr-3 h-5 w-5" /> My Orders
                </Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start text-lg font-medium text-[#222222] hover:bg-gray-100 hover:text-[#D81E05]">
                <Link to="/wishlist">
                  <Heart className="mr-3 h-5 w-5" /> Wishlist
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start text-lg font-medium text-[#222222] hover:bg-gray-100 hover:text-[#D81E05]">
                <MapPin className="mr-3 h-5 w-5" /> Addresses
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="justify-start text-lg font-medium text-red-500 hover:bg-red-50 mt-4">
                <LogOut className="mr-3 h-5 w-5" /> Logout
              </Button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            {/* Profile Overview Section */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-semibold text-[#222222]">Personal Information</h2>
                <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)} className="border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white">
                  <Edit className="mr-2 h-4 w-4" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...register("email")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  <Button type="submit" className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 px-6 font-semibold">
                    Save Changes
                  </Button>
                </form>
              ) : (
                <div className="space-y-2 text-lg">
                  <p><strong>Name:</strong> {userName}</p>
                  <p><strong>Email:</strong> {userEmail || 'N/A'}</p>
                  <p><strong>Member Since:</strong> July 2024</p> {/* Dummy data */}
                </div>
              )}
            </div>

            {/* Order History Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#222222]">Order History</h2>
              {dummyOrders.length === 0 ? (
                <p className="text-gray-600">You haven't placed any orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                        <th className="py-3 px-4 border-b">Order ID</th>
                        <th className="py-3 px-4 border-b">Date</th>
                        <th className="py-3 px-4 border-b">Total</th>
                        <th className="py-3 px-4 border-b">Status</th>
                        <th className="py-3 px-4 border-b">Items</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 border-b">{order.id}</td>
                          <td className="py-3 px-4 border-b">{order.date}</td>
                          <td className="py-3 px-4 border-b">KES {order.total.toFixed(2)}</td>
                          <td className="py-3 px-4 border-b">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                              ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                            `}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b">{order.items}</td>
                          <td className="py-3 px-4 border-b">
                            <Button variant="link" className="text-[#D81E05] hover:underline p-0 h-auto">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Addresses Section (Placeholder) */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 border-b pb-4 text-[#222222]">My Addresses</h2>
              <p className="text-gray-600 mb-4">You have no saved addresses.</p>
              <Button variant="outline" className="border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white">
                Add New Address
              </Button>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default ProfilePage;
