// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, Mail, Instagram, Facebook, Music2, Music2Icon } from 'lucide-react'; // Added X, Phone, Mail, Socials
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Import Sheet components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { ALL_CATEGORIES } from '@/services/product-service'; // Import all categories

// Custom TikTok icon (since Lucide doesn't have it directly)
const TikTokIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.525 1.516a11.956 11.956 0 0 1 7.849 7.653c.706 3.03-.047 5.965-2.005 8.614-1.347 1.877-3.116 3.48-5.18 4.074v-3.816c1.163-.114 2.23-.527 3.146-1.178.879-.625 1.564-1.424 2.015-2.31a6.004 6.004 0 0 0 .193-3.567c-.244-1.109-.835-2.126-1.688-2.946-.853-.82-1.87-1.41-2.979-1.654a6.004 6.004 0 0 0-3.567.193c-.886.45-1.685 1.135-2.31 2.015-.625.879-1.038 1.946-1.152 3.109v4.067c-2.064-.594-3.833-2.2-5.18-4.074-1.958-2.649-2.711-5.584-2.005-8.614a11.956 11.956 0 0 1 7.849-7.653z"/>
  </svg>
);


const Header: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Filter out "New In" and "Sale" as they have dedicated sections/routes
  const mainCategories = ALL_CATEGORIES.filter(
    (cat) => cat !== "New In" && cat !== "Sale"
  );

  // Function to close the sheet
  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Promo Bar & Contact/Socials */}
      <div className="bg-[#222222] text-white text-xs py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Section: Contact & Socials */}
        <div className="flex items-center gap-4">
          {/* Contact Details */}
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-[#FFD700]" />
            <a href="tel:+254712345678" className="hover:text-[#FFD700] transition-colors">
              +254 712 345 678
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-[#FFD700]" />
            <a href="mailto:support@krystalstore.com" className="hover:text-[#FFD700] transition-colors">
              support@krystalstore.com
            </a>
          </div>
          {/* Social Icons - Hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-3 ml-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-[#FFD700] transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-[#FFD700] transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white hover:text-[#FFD700] transition-colors">
              <Music2Icon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Right Section: Animated Promo Text */}
        <div className="relative overflow-hidden w-full sm:w-auto text-center sm:text-right">
          <style jsx>{`
            @keyframes slide-in-out {
              0% { transform: translateX(100%); opacity: 0; }
              10% { transform: translateX(0); opacity: 1; }
              90% { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(-100%); opacity: 0; }
            }
            .animate-promo {
              animation: slide-in-out 10s infinite ease-in-out; /* Adjust timing as needed */
            }
          `}</style>
          <span className="inline-block text-[#FFD700] font-medium animate-promo whitespace-nowrap">
            🎉 FREE SHIPPING ON ALL ORDERS! LIMITED TIME! 🎉
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#D81E05] shadow-md border-b border-[#A01A04]"> {/* Krystal Red */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle (Sheet Trigger) */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-[#A01A04]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-[#222222] text-white border-r border-[#A01A04] flex flex-col">
              <SheetHeader className="pb-4 border-b border-gray-700">
                <SheetTitle className="text-white text-2xl font-bold">KRYSTAL STORE</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Shop the latest trends.
                </SheetDescription>
              </SheetHeader>
              <div className="pt-4 pb-6">
                {/* Mobile Search Bar */}
                <div className="relative mb-6">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 rounded-full bg-gray-700 border-none focus:ring-2 focus:ring-[#FFD700] text-white placeholder:text-gray-400"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  <Link to="/new-in" onClick={closeSheet} className="block py-2 hover:text-[#FFD700] transition-colors">New In</Link>
                  <Link to="/sale" onClick={closeSheet} className="block py-2 font-bold text-[#FFD700] hover:text-white transition-colors">Sale</Link>

                  {/* Mobile Categories (simple list for Sheet) */}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h3 className="text-gray-400 text-sm uppercase mb-2">Shop by Category</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> {/* Simple grid for mobile categories */}
                      {mainCategories.map(category => (
                        <Link key={category} to={`/category/${encodeURIComponent(category)}`} onClick={closeSheet} className="block py-2 px-3 rounded-md hover:bg-[#D81E05] hover:text-white transition-colors text-base">
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link to="/contact" onClick={closeSheet} className="block py-2 border-t border-gray-700 pt-4 mt-4 hover:text-[#FFD700] transition-colors">Contact</Link>
                </nav>
              </div>

              {/* Mobile Action Icons (Optional, simplified) */}
              <div className="mt-auto pt-6 border-t border-gray-700 flex justify-around items-center">
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]">
                  <Heart className="h-6 w-6" />
                  <span className="sr-only">Wishlist</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="sr-only">Cart</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]">
                  <User className="h-6 w-6" />
                  <span className="sr-only">Account</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="font-bold text-3xl text-white tracking-wider flex-shrink-0">
            KRYSTAL STORE
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="flex-grow max-w-xl hidden lg:block relative">
            <Input
              type="search"
              placeholder="Search for products, categories, brands..."
              className="w-full pl-10 pr-4 rounded-full bg-white bg-opacity-90 border-none focus:ring-2 focus:ring-[#FFD700] text-[#222222] placeholder:text-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5" />
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link to="/new-in" className="text-white hover:text-[#FFD700] transition-colors">New In</Link>
            <Link to="/sale" className="font-bold text-[#FFD700] hover:text-white transition-colors">Sale</Link>

            {/* Categories Mega Menu (Desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="text-white cursor-pointer hover:text-[#FFD700] transition-colors flex items-center gap-1">
                  Categories <Menu className="h-4 w-4" /> {/* Small icon next to Categories */}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[600px] p-4 bg-[#222222] text-white rounded-md shadow-lg z-20">
                <DropdownMenuLabel className="text-[#FFD700] text-lg mb-3">Shop by Category</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700 mb-3" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3"> {/* Rows and columns */}
                  {mainCategories.map(category => (
                    <DropdownMenuItem asChild key={category} className="p-0 focus:bg-transparent">
                      <Link to={`/category/${encodeURIComponent(category)}`} className="block px-3 py-2 rounded-md hover:bg-[#D81E05] hover:text-white transition-colors text-base">
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

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
      </div>
    </header>
  );
};

export default Header;

