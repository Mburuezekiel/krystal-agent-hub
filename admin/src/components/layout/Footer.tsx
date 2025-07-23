import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#222222] text-gray-300 py-10 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            KRYSTAL TRADERS
          </h3>
          <p className="text-sm leading-relaxed">
            Your ultimate online destination for diverse products, from fashion
            to home essentials, electronics, and more.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/new-in"
                className="hover:text-[#FFD700] transition-colors"
              >
                New In
              </Link>
            </li>
            <li>
              <Link
                to="/sale"
                className="hover:text-[#FFD700] transition-colors"
              >
                Sale
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="hover:text-[#FFD700] transition-colors"
              >
                All Categories
              </Link>
            </li>
            <li>
              <Link
                to="/gift-cards"
                className="hover:text-[#FFD700] transition-colors"
              >
                Gift Cards
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/faq"
                className="hover:text-[#FFD700] transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/shipping"
                className="hover:text-[#FFD700] transition-colors"
              >
                Shipping Information
              </Link>
            </li>
            <li>
              <Link
                to="/returns"
                className="hover:text-[#FFD700] transition-colors"
              >
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link
                to="/size-guide"
                className="hover:text-[#FFD700] transition-colors"
              >
                Size Guides
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#FFD700]" />
              <a
                href="mailto:support@krystalstore.com"
                className="hover:text-[#FFD700] transition-colors"
              >
                support@krystalstore.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#FFD700]" />
              <a
                href="tel:+254712345678"
                className="hover:text-[#FFD700] transition-colors"
              >
                +254 700 282 618
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#FFD700]" />
              <a
                href="tel:+254712345678"
                className="hover:text-[#FFD700] transition-colors"
              >
                +254 729 770 384
              </a>
            </li>

            <li>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rendile+Arcade+plaza+opposite+Kamukunji+police+station,+Ukwala+road"
                target="_blank"
                rel="noopener noreferrer"
             
              >
                <MapPin
                  className="h-4 w-4 text-[#FFD700] margin-right: 8px"
                 
                />
                <span>
                  Rendile Arcade plaza opposite Kamukunji police station, along
                  Ukwala road
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} KRYSTAL TRADERS. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link
            to="/privacy-policy"
            className="hover:text-[#FFD700] transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="hover:text-[#FFD700] transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
