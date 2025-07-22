

// src/pages/GiftCardsPage.tsx
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GiftCardsPage: React.FC = () => {
  return (
    <>
    
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Gift Cards</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg mb-6">
            Give the gift of choice with a Krystal Store Gift Card! Perfect for any occasion.
          </p>
          <img
            src="https://placehold.co/600x300/FFD700/222222?text=KRYSTAL+GIFT+CARD"
            alt="Krystal Store Gift Card"
            className="w-full h-auto rounded-lg mb-8 shadow-sm"
          />
          <h2 className="text-2xl font-semibold mb-4">Purchase a Gift Card</h2>
          <div className="space-y-4 mb-8">
            <Button className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 font-semibold">
              Buy KES 1,000 Gift Card
            </Button>
            <Button className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 font-semibold">
              Buy KES 2,500 Gift Card
            </Button>
            <Button className="w-full bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-md py-2 font-semibold">
              Buy KES 5,000 Gift Card
            </Button>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Check Gift Card Balance</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter Gift Card Code"
              className="flex-grow px-4 py-2 border rounded-md focus:border-[#D81E05] focus:ring-[#D81E05]"
            />
            <Button className="bg-[#222222] hover:bg-gray-700 text-white rounded-md px-6 py-2 font-semibold">
              Check Balance
            </Button>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default GiftCardsPage;