import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, Package, Heart, LogOut, MapPin, Edit, Loader2, AlertCircle, CheckCircle, Menu, X } from 'lucide-react'; // Added Menu, X icons
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/services/userService';
import { getUserOrders, Order } from '@/services/ordersService';

// --- Zod Schema for Profile Validation (Password fields removed) ---
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userName: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, or periods"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional()
    .refine(val => !val || /^(\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/.test(val),
      "Invalid phone number format (e.g., +123 456 7890 or 07XXXXXXXX)"),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userName: contextUserName, logout, login } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
  });

  // --- Fetches user profile data from the backend ---
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfileData = await getUserProfile();
      setProfile(userProfileData);

      // Fetch recent orders
      try {
        const orders = await getUserOrders();
        setRecentOrders(orders.slice(0, 5)); // Get last 5 orders
      } catch (orderErr) {
        console.error('Failed to fetch recent orders:', orderErr);
        // Don't set error for orders, just log it
      }

      // Initialize form fields with fetched data
      reset({
        firstName: userProfileData.firstName || '',
        lastName: userProfileData.lastName || '',
        userName: userProfileData.userName || '',
        email: userProfileData.email || '',
        phoneNumber: userProfileData.phoneNumber || '',
        address: userProfileData.address || '',
      });
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Could not load profile. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);

      // Handle re-authentication if token is invalid
      if (err.message.includes('token failed') || err.message.includes('No authentication token')) {
          logout();
          navigate('/login');
          toast.info('Your session has expired. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  }, [reset, logout, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      toast.info('Please log in to view your profile.');
      return;
    }
    fetchProfile();
  }, [isLoggedIn, navigate, fetchProfile]);

  // --- Handles updating the user's profile information ---
  const handleProfileUpdate = async (data: ProfileFormValues) => {
    try {
      setError(null);

      const updatePayload: Partial<ProfileFormValues> = {
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
          email: data.email,
          phoneNumber: data.phoneNumber === '' ? undefined : data.phoneNumber,
          address: data.address === '' ? undefined : data.address,
      };

      const updatedProfile = await updateUserProfile(updatePayload);

      setProfile(updatedProfile);
      setIsEditingProfile(false); // Exit edit mode
      toast.success("Profile updated successfully!");

      // If username changed, update auth context to reflect new username immediately
      if (updatedProfile.userName && updatedProfile.userName !== contextUserName) {
          const currentToken = localStorage.getItem('userToken');
          if (currentToken) {
              login(currentToken, updatedProfile.userName);
          }
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile. Server error.';
      setError(errorMessage);
      toast.error(`Profile update failed: ${errorMessage}`);
    }
  };

  // --- Handles user logout ---
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('You have been logged out.');
  };

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-[#F8F8F8] p-4 text-[#222222]">
        <Loader2 className="h-12 w-12 animate-spin text-[#D81E05] mb-4" />
        <p className="text-xl md:text-2xl font-semibold">Loading your profile...</p>
        <p className="text-gray-600 mt-2">Please wait a moment.</p>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-[#F8F8F8] p-4 text-[#222222]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-red-600">Error Loading Profile</h1>
        <p className="text-lg text-red-500 text-center max-w-md">{error}</p>
        <Button onClick={fetchProfile} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md px-6 py-3 font-semibold">
          <Loader2 className={loading ? "animate-spin mr-2" : "hidden"} />
          Retry
        </Button>
      </div>
    );
  }

  // --- Render No Profile Data State (Fallback) ---
  if (!profile) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-[#F8F8F8] p-4 text-[#222222]">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#222222]">No Profile Data Available</h1>
            <p className="text-lg text-gray-600 text-center max-w-md">We couldn't retrieve your profile information. Please ensure you are logged in.</p>
            <Button asChild className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md px-6 py-3 font-semibold">
                <Link to="/login">Go to Login</Link>
            </Button>
        </div>
    );
  }

  // --- Main Profile Content ---
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] font-inter">
      <div className="flex justify-between items-center mb-6 lg:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#D81E05]">My Profile</h1>
        {/* Mobile Menu Toggle Button - Visible only on small screens */}
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden  hover:bg-[#D81E05] hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto relative"> {/* Added relative for mobile menu positioning */}

        {/* Account Navigation Sidebar (Hidden on small screens by default) */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-full w-64 lg:w-auto bg-white p-6 rounded-lg shadow-lg lg:shadow-md
            transform transition-transform duration-300 ease-in-out z-40 lg:z-auto
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:col-span-1 flex flex-col border border-gray-100
          `}
        >
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-xl font-semibold text-[#222222]">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <h2 className="hidden lg:block text-xl md:text-2xl font-semibold mb-6 border-b pb-4 text-[#222222]">Account Navigation</h2>
          <nav className="flex flex-col gap-2 md:gap-3 flex-grow">
            <Button variant="ghost" className="justify-start text-base md:text-lg font-medium text-[#D81E05] hover:bg-gray-100 hover:text-[#D81E05] rounded-md px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
            >
              <UserCircle className="mr-3 h-5 w-5" /> Profile Overview
            </Button>
            <Button variant="ghost" asChild className="justify-start text-base md:text-lg font-medium text-[#222222] hover:bg-gray-100 hover:text-[#D81E05] rounded-md px-4 py-2">
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                <Package className="mr-3 h-5 w-5" /> My Orders
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start text-base md:text-lg font-medium text-[#222222] hover:bg-gray-100 hover:text-[#D81E05] rounded-md px-4 py-2">
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart className="mr-3 h-5 w-5" /> Wishlist
              </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start text-base md:text-lg font-medium text-[#222222] hover:bg-gray-100 hover:text-[#D81E05] rounded-md px-4 py-2">
              <Link to="/addresses" onClick={() => setIsMobileMenuOpen(false)}>
                <MapPin className="mr-3 h-5 w-5" /> Addresses
              </Link>
            </Button>
            <div className="mt-auto pt-4 border-t border-gray-100">
                <Button onClick={handleLogout} variant="ghost" className="justify-start text-base md:text-lg font-medium text-red-500 hover:bg-red-50 rounded-md px-4 py-2 w-full">
                    <LogOut className="mr-3 h-5 w-5" /> Logout
                </Button>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Personal Information Section */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-[#222222]">Personal Information</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditingProfile(!isEditingProfile);
                  if (isEditingProfile) {
                    reset({
                      firstName: profile.firstName || '',
                      lastName: profile.lastName || '',
                      userName: profile.userName || '',
                      email: profile.email || '',
                      phoneNumber: profile.phoneNumber || '',
                      address: profile.address || '',
                    });
                  }
                }}
                className="border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white transition-colors duration-200"
              >
                <Edit className="mr-2 h-4 w-4" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSubmit(handleProfileUpdate)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input id="firstName" {...register("firstName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="userName" className="text-sm font-medium text-gray-700">Username</Label>
                  <Input id="userName" {...register("userName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                  {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input id="email" type="email" {...register("email")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number (Optional)</Label>
                  <Input id="phoneNumber" type="tel" {...register("phoneNumber")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address (Optional)</Label>
                  <Input id="address" {...register("address")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div className="md:col-span-2 mt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 px-6 font-semibold transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <><Loader2 className="animate-spin mr-2" /> Saving...</> : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-base md:text-lg">
                <p className="flex items-center gap-2"><strong className="text-gray-700">Username:</strong> {profile.userName} <CheckCircle className="h-4 w-4 text-green-500" /></p>
                <p><strong className="text-gray-700">First Name:</strong> {profile.firstName}</p>
                <p><strong className="text-gray-700">Last Name:</strong> {profile.lastName}</p>
                <p className="md:col-span-2"><strong className="text-gray-700">Email:</strong> {profile.email}</p>
                <p><strong className="text-gray-700">Phone Number:</strong> {profile.phoneNumber || 'N/A'}</p>
                <p><strong className="text-gray-700">Address:</strong> {profile.address || 'N/A'}</p>
                <p className="md:col-span-2 text-sm text-gray-500">
                    <strong className="text-gray-700">Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </section>

          {/* Recent Orders Section */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl md:text-2xl font-semibold text-[#222222]">Recent Orders</h2>
              <Button variant="outline" asChild className="border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white">
                <Link to="/orders">View All Orders</Link>
              </Button>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white">
                  <Link to="/">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">Order #{order.orderNumber || order._id.slice(-8)}</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <p>{order.items.length} item{order.items.length !== 1 ? 's' : ''} • KES {order.totalAmount.toFixed(2)}</p>
                      </div>
                      <Button variant="link" className="text-[#D81E05] hover:underline p-0 h-auto" asChild>
                        <Link to={`/orders/${order._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Addresses Section (Placeholder) */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 border-b pb-4 text-[#222222]">My Addresses</h2>
            <p className="text-gray-600 mb-4">You have no saved addresses yet. Add one to speed up checkout!</p>
            <Button variant="outline" className="border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white rounded-md px-4 py-2 transition-colors duration-200">
              Add New Address
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;