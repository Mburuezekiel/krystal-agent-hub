import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, X } from 'lucide-react'; // Importing icons from lucide-react

// Define the schema for the contact form using Zod
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Infer the TypeScript type from the schema
type ContactFormValues = z.infer<typeof contactFormSchema>;

// Custom Input component using Tailwind CSS
const Input = ({ id, label, type = 'text', register, error, className = '' }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D81E05] focus:border-transparent transition duration-200 ${className}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

// Custom Textarea component using Tailwind CSS
const Textarea = ({ id, label, register, error, rows = 5, className = '' }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      {...register(id)}
      rows={rows}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D81E05] focus:border-transparent transition duration-200 ${className}`}
    ></textarea>
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

// Custom Button component using Tailwind CSS
const Button = ({ children, type = 'button', className = '', onClick }: any) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full bg-[#D81E05] hover:bg-[#A01A04] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D81E05] focus:ring-opacity-75 ${className}`}
  >
    {children}
  </button>
);

const ContactPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const [messageSent, setMessageSent] = useState(false);

  // Function to handle form submission
  const onSubmit = (data: ContactFormValues) => {
    console.log("Contact Form Submitted:", data);
    // In a real application, you would send this data to a backend API
    // For this example, we'll just show a success message
    setMessageSent(true);
    reset(); // Reset the form fields after submission
  };

  // Function to close the success message
  const closeMessage = () => {
    setMessageSent(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#222222] font-inter">
      {/* Success Message Modal */}
      {messageSent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full relative">
            <button onClick={closeMessage} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-center text-[#D81E05] mb-4">Message Sent!</h3>
            <p className="text-center text-gray-700 mb-6">
              Thank you for your message! We will get back to you soon.
            </p>
            <Button onClick={closeMessage}>
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 md:mb-8 text-[#D81E05]">
          Get In Touch
        </h1>
        <p className="text-center text-lg md:text-xl mb-10 md:mb-12 max-w-3xl mx-auto text-gray-700">
          We'd love to hear from you! Whether you have a question about our products, need assistance, or just want to provide feedback, feel free to reach out.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Contact Information Section */}
          <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#222222]">Our Details</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Mail size={28} className="text-[#D81E05]" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Email Us</h3>
                    <a href="mailto:support@krystalstore.com" className="text-blue-600 hover:underline text-lg">
                      support@krystalstore.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone size={28} className="text-[#D81E05]" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Call Us</h3>
                    <p className="text-lg text-gray-700">+254 700 282 618</p>
                    <p className="text-lg text-gray-700">+254 729 770 384</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin size={28} className="text-[#D81E05] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Visit Us</h3>
                    <p className="text-lg text-gray-700">Rendile Arcade plaza opposite Kamukunji police station,</p>
                    <p className="text-lg text-gray-700">along Ukwala road</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-[#222222]">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                id="name"
                label="Your Name"
                register={register}
                error={errors.name}
              />
              <Input
                id="email"
                label="Your Email"
                type="email"
                register={register}
                error={errors.email}
              />
              <Input
                id="subject"
                label="Subject"
                register={register}
                error={errors.subject}
              />
              <Textarea
                id="message"
                label="Your Message"
                register={register}
                error={errors.message}
                rows={6}
              />
              <Button type="submit">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
