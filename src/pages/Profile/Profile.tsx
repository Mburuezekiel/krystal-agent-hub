import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserCircle, Package, Heart, LogOut, MapPin, Edit } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile } from '@/services/userService';

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
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
})
.refine(
  (data) => {
    if (data.password && data.password.length < 6) {
      return false;
    }
    return true;
  },
  {
    message: "Password must be at least 6 characters",
    path: ["password"],
  }
)
.refine(
  (data) => {
    if (data.password) {
      return data.confirmPassword === data.password;
    }
    return true;
  },
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);


type ProfileFormValues = z.infer<typeof profileSchema>;

const dummyOrders = [
  { id: 'ORD001', date: '2024-07-15', total: 12500, status: 'Delivered', items: 3 },
  { id: 'ORD002', date: '2024-07-20', total: 8500, status: 'Processing', items: 2 },
  { id: 'ORD003', date: '2024-07-22', total: 3200, status: 'Shipped', items: 1 },
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userName: contextUserName, logout, login } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfileData = await getUserProfile();
        setProfile(userProfileData);
        reset({
          firstName: userProfileData.firstName,
          lastName: userProfileData.lastName,
          userName: userProfileData.userName,
          email: userProfileData.email,
          phoneNumber: userProfileData.phoneNumber || '',
          address: userProfileData.address || '',
        });
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError(err.message || 'Could not load profile. Please try again.');
        if (err.message.includes('token failed') || err.message.includes('No authentication token')) {
            logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isLoggedIn, navigate, reset, logout]);

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    console.log("Updating Profile with data:", data);

    try {
      setLoading(true);
      setError(null);

      const updatePayload: any = {
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
      };

      if (data.password) {
          updatePayload.password = data.password;
      }

      const updatedProfile = await updateUserProfile(updatePayload);

      setProfile(updatedProfile);
      setIsEditingProfile(false);

      if (updatedProfile.userName !== contextUserName) {
          const currentToken = localStorage.getItem('userToken');
          if (currentToken) {
              login(currentToken, updatedProfile.userName);
          }
      }
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile.');
      alert("Profile update failed: " + (err.message || 'Server error.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-[#222222]">
        <h1 className="text-3xl font-bold mb-4">Loading Profile...</h1>
        <p>Please wait while your profile data is fetched.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-4">Error Loading Profile</h1>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-[#D81E05] hover:bg-[#A01A04] text-white">
          Retry
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
        <div className="container mx-auto px-4 py-12 text-center text-[#222222]">
            <h1 className="text-3xl font-bold mb-4">No Profile Data</h1>
            <p>Could not retrieve profile information.</p>
        </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#D81E05]">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-semibold text-[#222222]">Personal Information</h2>
                <Button variant="outline" size="sm" onClick={() => {
                    setIsEditingProfile(!isEditingProfile);
                    if (isEditingProfile) {
                      reset({
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        userName: profile.userName,
                        email: profile.email,
                        phoneNumber: profile.phoneNumber || '',
                        address: profile.address || '',
                        password: '',
                        confirmPassword: '',
                      });
                    }
                }} className="border-[#D81E05] text-[#D81E05] hover:bg-[#D81E05] hover:text-white">
                  <Edit className="mr-2 h-4 w-4" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Username</Label>
                    <Input id="userName" {...register("userName")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                    {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>}
                  </div>
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
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                    <Input id="phoneNumber" type="tel" {...register("phoneNumber")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input id="address" {...register("address")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">New Password (Optional)</Label>
                    <Input id="password" type="password" {...register("password")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" placeholder="Leave blank to keep current" />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]" placeholder="Re-enter new password" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                  <Button type="submit" className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 px-6 font-semibold">
                    Save Changes
                  </Button>
                </form>
              ) : (
                <div className="space-y-2 text-lg">
                  <p><strong>Username:</strong> {profile.userName}</p>
                  <p><strong>First Name:</strong> {profile.firstName}</p>
                  <p><strong>Last Name:</strong> {profile.lastName}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone Number:</strong> {profile.phoneNumber || 'N/A'}</p>
                  <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
                
                  <p><strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>

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