import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert('Error: ' + (result.message || 'Could not process request.'));
      }
    } catch (error) {
      console.error('Network error during forgot password request:', error);
      alert('Network error. Please try again.');
    }
    reset();
  };

  return (
    <>
    
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-6 text-[#D81E05]">Forgot Your Password?</h1>
          <p className="text-center text-gray-600 mb-6">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
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
            <Button type="submit" className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 font-semibold">
              Send Reset Link
            </Button>
          </form>
          <p className="text-center text-sm mt-6 text-gray-600">
            Remembered your password?{" "}
            <Link to="/login" className="text-[#D81E05] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
     
    </>
  );
};

export default ForgotPasswordPage;
