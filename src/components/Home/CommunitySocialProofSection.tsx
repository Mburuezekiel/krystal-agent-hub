// src/components/sections/CommunitySocialProofSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Instagram, Facebook } from 'lucide-react';

const newsletterFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

interface CustomerPhoto {
  id: string;
  src: string;
  alt: string;
  link?: string; // Link to the product or user's profile
}

const customerPhotos: CustomerPhoto[] = [
  { id: 'cp1', src: 'https://placehold.co/400x400/D81E05/FFFFFF?text=Customer+1', alt: 'Customer wearing a red dress', link: '/product/p1' },
  { id: 'cp2', src: 'https://placehold.co/400x400/222222/FFFFFF?text=Customer+2', alt: 'Customer with a black bag', link: '/product/p14' },
  { id: 'cp3', src: 'https://placehold.co/400x400/FFD700/222222?text=Customer+3', alt: 'Customer showing off jewelry', link: '/product/p13' },
  { id: 'cp4', src: 'https://placehold.co/400x400/F8F8F8/222222?text=Customer+4', alt: 'Customer in home setting', link: '/product/p11' },
];

const CommunitySocialProofSection: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
  });

  const onSubmit = (data: NewsletterFormValues) => {
    console.log('Newsletter Signup:', data);
    // Here you would typically send data to your backend
    // Using a simple alert for demonstration, replace with a custom modal/toast
    // IMPORTANT: DO NOT use window.alert() in production apps, use a custom modal
    alert('Thank you for subscribing to Krystal Store!');
    reset(); // Clear the form
  };

  return (
    <section className="py-8 bg-[#F8F8F8] rounded-lg shadow-inner"> {/* Krystal Light background */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]"> {/* Krystal Dark */}
           Shop the Look & Join Our Community 
        </h2>

        {/* Customer Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {customerPhotos.map((photo) => (
            <div key={photo.id} className="relative group overflow-hidden rounded-lg aspect-square shadow-sm">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {photo.link && (
                <Link to={photo.link} className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-semibold p-2 bg-[#D81E05] rounded-full">Shop This Look</span> {/* Krystal Red */}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-lg mx-auto mb-12">
          <h3 className="text-2xl font-semibold mb-3 text-[#222222]">Stay in the Loop!</h3> {/* Krystal Dark */}
          <p className="text-gray-600 mb-4">
            Get exclusive deals, new arrivals, and style tips straight to your inbox.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <Input
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
                className="w-full rounded-full px-4 py-2 border focus:border-[#D81E05] focus:ring-[#D81E05] text-[#222222]" // Krystal Red focus
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-6 py-2 font-semibold"> {/* Krystal Red */}
              Subscribe
            </Button>
          </form>
        </div>

        {/* Social Media Links */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4 text-[#222222]">Connect With Us</h3> {/* Krystal Dark */}
          <div className="flex justify-center gap-6">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#222222] hover:text-[#D81E05] transition-colors"> {/* Krystal Dark & Red */}
              <Instagram className="h-8 w-8" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#222222] hover:text-[#D81E05] transition-colors"> {/* Krystal Dark & Red */}
              <Facebook className="h-8 w-8" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySocialProofSection;

