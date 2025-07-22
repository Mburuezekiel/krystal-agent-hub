
// src/pages/TermsOfServicePage.tsx
import React from 'react';


const TermsOfServicePage: React.FC = () => {
  return (
    <>
   
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
        <div className="max-w-3xl mx-auto text-lg space-y-6">
          <p>
            Welcome to Krystal Store! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Use of the Website</h2>
          <p>
            You agree to use the website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content or disrupting the normal flow of dialogue within the website.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of Krystal Store or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Product Information</h2>
          <p>
            We strive to ensure that all product descriptions, prices, and availability are accurate. However, errors may occur. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Limitation of Liability</h2>
          <p>
            Krystal Store will not be liable for any damages of any kind arising from the use of this website, including, but not limited to, direct, indirect, incidental, punitive, and consequential damages.
          </p>
          <p>
            By continuing to use our website, you agree to these Terms of Service.
          </p>
        </div>
      </div>
  
    </>
  );
};

export default TermsOfServicePage;