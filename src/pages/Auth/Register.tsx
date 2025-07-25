import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

import { useAuth } from "@/context/AuthContext";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_.]+$/,
        "Username can only contain letters, numbers, underscores, or periods"
      ),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^(\+?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/.test(val),
        "Invalid phone number format (e.g., +123 456 7890 or 07XXXXXXXX)"
      ),
    address: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://krystal-agent-hub.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok) {
        login(result.token, result.userName);
        toast.success(`Registration successful! Welcome, ${result.userName}`, {
          position: 'bottom-right',
          duration: 5000,
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
        });
        navigate("/");
      } else {
        toast.error(
          `Registration failed: ${result.message || "Please check your input."}`,
          {
            position: 'bottom-right',
            duration: 5000,
            ariaProps: {
              role: 'alert',
              'aria-live': 'assertive',
            },
          }
        );
      }
    } catch (error) {
      console.error("Network error during registration:", error);
      toast.error("Network error. Please try again.", {
        position: 'bottom-right',
        duration: 5000,
        ariaProps: {
          role: 'alert',
          'aria-live': 'assertive',
        },
      });
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#D81E05]">
            Create Your Account
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                {...register("userName")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.userName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                {...register("address")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="mt-1 focus:ring-[#D81E05] focus:border-[#D81E05]"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D81E05] hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            duration: 5000,
            style: {
              background: '#4CAF50',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#4CAF50',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#D81E05',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#D81E05',
            },
          },
          style: {
            borderRadius: '8px',
            padding: '16px',
            fontSize: '16px',
          },
        }}
        containerStyle={{
          bottom: 20,
          right: 20,
        }}
      />
    </>
  );
};

export default RegisterPage;