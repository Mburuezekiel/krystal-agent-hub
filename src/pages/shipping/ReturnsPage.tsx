

// src/pages/ReturnsPage.tsx
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ReturnsPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Returns & Refunds</h1>
        <div className="max-w-3xl mx-auto text-lg space-y-6">
          <p>
            We want you to be completely satisfied with your purchase from Krystal Store. If for any reason you are not, we offer a straightforward return and refund process.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Our Return Policy:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Items can be returned within <strong>14 days</strong> of delivery.</li>
            <li>Products must be unused, unwashed, and in their original packaging with all tags attached.</li>
            <li>Certain items (e.g., underwear, personalized items, some beauty products) are non-returnable for hygiene reasons.</li>
          </ul>
          <h2 className="text-2xl font-semibold text-[#D81E05]">How to Initiate a Return:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Log in to your account and go to your order history.</li>
            <li>Select the order containing the item(s) you wish to return.</li>
            <li>Follow the instructions to request a return authorization.</li>
            <li>Pack the item(s) securely and ship them back to us.</li>
          </ol>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Refunds:</h2>
          <p>
            Once your return is received and inspected, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method. Shipping fees are non-refundable unless the return is due to our error.
          </p>
          <p>
            For more detailed information, please contact our customer support.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReturnsPage;