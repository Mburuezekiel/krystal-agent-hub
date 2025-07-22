
// src/pages/PrivacyPolicyPage.tsx
import React from 'react';


const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
     
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <div className="max-w-3xl mx-auto text-lg space-y-6">
          <p>
            At Krystal Store, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the website, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. This information may include your name, email address, mailing address, phone number, and payment information.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Process your transactions and manage your orders.</li>
            <li>Send you marketing and promotional communications.</li>
            <li>Improve our website and services.</li>
            <li>Personalize your experience on our website.</li>
            <li>Respond to your customer service requests.</li>
          </ul>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Disclosure of Your Information</h2>
          <p>
            We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, other than as described herein.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
          <p>
            By using our website, you consent to our Privacy Policy.
          </p>
        </div>
      </div>
     
    </>
  );
};

export default PrivacyPolicyPage;