
// src/pages/ShippingPage.tsx
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const ShippingPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Shipping Information</h1>
        <div className="max-w-3xl mx-auto text-lg space-y-6">
          <p>
            We offer reliable and efficient shipping services across Kenya. Our goal is to get your order to you as quickly and safely as possible.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Shipping Options & Times:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Standard Shipping:</strong> 3-5 business days. Free for orders over KES 5,000.</li>
            <li><strong>Express Shipping:</strong> 1-2 business days. Available for an additional fee.</li>
            <li><strong>Remote Area Delivery:</strong> May take longer depending on location.</li>
          </ul>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Shipping Costs:</h2>
          <p>
            Shipping costs are calculated at checkout based on your delivery address and the total weight/size of your order. You will see the exact cost before finalizing your purchase.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Order Tracking:</h2>
          <p>
            Once your order is dispatched, you will receive a shipping confirmation email with a tracking number. You can use this number to track the progress of your delivery on our partner courier's website.
          </p>
          <p>
            For any shipping-related inquiries, please contact our customer service team.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingPage;