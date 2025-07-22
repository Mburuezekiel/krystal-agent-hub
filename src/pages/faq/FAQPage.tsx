

// src/pages/FAQPage.tsx
import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming you add Accordion from Shadcn

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "To place an order, simply browse our categories, add desired items to your cart, and proceed to checkout. Follow the prompts to enter your shipping and payment information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including M-Pesa, Visa, MasterCard, and American Express."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping within Kenya typically takes 3-5 business days. Express shipping options are also available."
    },
    {
      question: "Can I return an item?",
      answer: "Yes, we offer a 14-day return policy for most items, provided they are in their original condition. Please refer to our Returns & Refunds page for full details."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within Kenya. We are working to expand our shipping destinations in the future."
    }
  ];

  return (
    <>
    
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline text-[#222222] hover:text-[#D81E05]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
     
    </>
  );
};

export default FAQPage;