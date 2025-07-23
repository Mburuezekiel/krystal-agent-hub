
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Contact Form Submitted:", data);
    alert("Thank you for your message! We will get back to you soon.");
    reset();
  };

  return (
    <>
      
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
          Have a question or need assistance? Fill out the form below or reach out to us directly.
        </p>
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                id="name"
                {...register("name")}
                className="w-full px-4 py-2 border rounded-md focus:border-[#D81E05] focus:ring-[#D81E05]"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-2 border rounded-md focus:border-[#D81E05] focus:ring-[#D81E05]"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Input
                id="subject"
                {...register("subject")}
                className="w-full px-4 py-2 border rounded-md focus:border-[#D81E05] focus:ring-[#D81E05]"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <Textarea
                id="message"
                {...register("message")}
                rows={5}
                className="w-full px-4 py-2 border rounded-md focus:border-[#D81E05] focus:ring-[#D81E05]"
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 font-semibold">
              Send Message
            </Button>
          </form>
        </div>
      </div>
      
    </>
  );
};

export default ContactPage;