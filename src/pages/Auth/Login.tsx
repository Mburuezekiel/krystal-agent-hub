import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Import the useAuth hook
import { useAuth } from '@/context/AuthContext'; // Adjust path if necessary

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // Destructure the 'login' function from the useAuth hook
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // --- THIS IS THE KEY CHANGE ---
        // Pass result.userName (which comes from your backend) to the login function
        login(result.token, result.userName); // <-- Changed from result.firstName
        alert('Login successful! Welcome, ' + result.userName); // Update alert message too
        navigate('/'); // Redirect to home or dashboard after successful login
      } else {
        alert('Login failed: ' + (result.message || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Network error during login:', error);
      alert('Network error. Please try again.');
    }
    reset();
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#D81E05]">Login to Krystal Store</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-[#222222] hover:text-[#D81E05] transition-colors">
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 font-semibold">
              Login
            </Button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#D81E05] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;