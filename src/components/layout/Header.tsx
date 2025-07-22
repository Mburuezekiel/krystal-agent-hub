// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, User, Search, Menu } from 'lucide-react';
import { ALL_CATEGORIES } from '@/services/product-service'; // Import all categories

const Header: React.FC = () => {
  // Filter out "New In" and "Sale" as they have dedicated sections/routes
  const mainCategories = ALL_CATEGORIES.filter(
    (cat) => cat !== "New In" && cat !== "Sale"
  );

  return (
    <header className="sticky top-0 z-50 bg-[#D81E05] shadow-md border-b border-[#A01A04]"> {/* Krystal Red */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle (Hidden on larger screens) */}
        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-[#A01A04]">
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <Link to="/" className="font-bold text-3xl text-white tracking-wider flex-shrink-0"> {/* White text */}
          KRYSTAL STORE
        </Link>

        {/* Search Bar (Centered, takes available space) */}
        <div className="flex-grow max-w-xl hidden lg:block relative">
          <Input
            type="search"
            placeholder="Search for products, categories, brands..."
            className="w-full pl-10 pr-4 rounded-full bg-white bg-opacity-90 border-none focus:ring-2 focus:ring-[#FFD700] text-[#222222] placeholder:text-gray-500" // White input, Krystal Accent ring
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5" />
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link to="/new-in" className="text-white hover:text-[#FFD700] transition-colors">New In</Link> {/* Krystal Accent */}
          <Link to="/sale" className="font-bold text-[#FFD700] hover:text-white transition-colors">Sale</Link> {/* Krystal Accent */}
          {/* Example of a dropdown for categories (conceptual, would need Shadcn's DropdownMenu) */}
          <div className="relative group">
            <span className="text-white cursor-pointer hover:text-[#FFD700] transition-colors">Categories</span>
            {/* This would be a Shadcn DropdownMenuContent */}
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-[#222222] text-white rounded-md shadow-lg py-2 z-20 min-w-[200px]">
              {mainCategories.map(category => (
                <Link key={category} to={`/category/${encodeURIComponent(category)}`} className="block px-4 py-2 hover:bg-[#D81E05] hover:text-white transition-colors text-sm">
                  {category}
                </Link>
              ))}
            </div>
          </div>
          {/* For other top-level categories, you might link directly or have more dropdowns */}
          <Link to="/contact" className="text-white hover:text-[#FFD700] transition-colors">Contact</Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden lg:flex text-white hover:bg-[#A01A04]">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
        </div>
      </div>
      {/* Optional: Small promo banner */}
      <div className="bg-[#222222] text-[#FFD700] text-center text-xs py-1.5 font-medium"> {/* Krystal Dark & Accent */}
        🎉 FREE SHIPPING ON ALL ORDERS! LIMITED TIME! 🎉
      </div>
    </header>
  );
};

export default Header;

