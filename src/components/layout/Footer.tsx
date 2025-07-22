// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#222222] text-gray-300 py-10 mt-12"> {/* Krystal Dark */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">KRYSTAL STORE</h3>
          <p className="text-sm leading-relaxed">
            Your ultimate online destination for diverse products, from fashion to home essentials, electronics, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/new-in" className="hover:text-[#FFD700] transition-colors">New In</Link></li> {/* Krystal Accent */}
            <li><Link to="/sale" className="hover:text-[#FFD700] transition-colors">Sale</Link></li>     {/* Krystal Accent */}
            <li><Link to="/categories" className="hover:text-[#FFD700] transition-colors">All Categories</Link></li> {/* Krystal Accent */}
            <li><Link to="/gift-cards" className="hover:text-[#FFD700] transition-colors">Gift Cards</Link></li>   {/* Krystal Accent */}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-[#FFD700] transition-colors">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-[#FFD700] transition-colors">Shipping Information</Link></li>
            <li><Link to="/returns" className="hover:text-[#FFD700] transition-colors">Returns & Refunds</Link></li>
            <li><Link to="/size-guide" className="hover:text-[#FFD700] transition-colors">Size Guides</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#FFD700]" /> {/* Krystal Accent icon */}
              <a href="mailto:support@krystalstore.com" className="hover:text-[#FFD700] transition-colors">support@krystalstore.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#FFD700]" /> {/* Krystal Accent icon */}
              <a href="tel:+254712345678" className="hover:text-[#FFD700] transition-colors">+254 712 345 678</a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#FFD700] transition-colors">Contact Form</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} KRYSTAL STORE. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link to="/privacy-policy" className="hover:text-[#FFD700] transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-[#FFD700] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

