// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, Mail, Instagram, Facebook, LogIn, LogOut, Package, UserCircle, Music2Icon } from 'lucide-react'; // Added X, Phone, Mail, Socials, Login/Logout, Package, UserCircle
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
  // Dummy authentication state for demonstration
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Set to true to test logged-in state
  const [userName, setUserName] = React.useState("John Doe"); // Dummy user name

  // Filter out "New In" and "Sale" as they have dedicated sections/routes
  const mainCategories = ALL_CATEGORIES.filter(
    (cat) => cat !== "New In" && cat !== "Sale"
  );

  // Function to close the sheet
  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    closeSheet(); // Close sheet after logout
    // In a real app, you'd call your authentication service logout method here
  };

  const handleLoginRedirect = () => {
    closeSheet(); // Close sheet before redirect
    // In a real app, you'd redirect to your login page
    alert("Redirecting to login page...");
  };


  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Promo Bar & Contact/Socials */}
      <div className="bg-[#F8F8F8] text-[#222222] text-xs py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-gray-200"> {/* Light theme */}
        {/* Left Section: Contact & Socials */}
        <div className="flex items-center gap-4">
          {/* Contact Details */}
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-[#D81E05]" /> {/* Krystal Red icon */}
            <a href="tel:+254712345678" className="hover:text-[#D81E05] transition-colors">
              +254 712 345 678
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-[#D81E05]" /> {/* Krystal Red icon */}
            <a href="mailto:support@krystalstore.com" className="hover:text-[#D81E05] transition-colors">
              support@krystalstore.com
            </a>
          </div>
          {/* Social Icons - Hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-3 ml-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#222222] hover:text-[#D81E05] transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#222222] hover:text-[#D81E05] transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-[#222222] hover:text-[#D81E05] transition-colors">
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
          <span className="inline-block text-[#D81E05] font-medium animate-promo whitespace-nowrap"> {/* Krystal Red text */}
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
            <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-white text-[#222222] border-r border-gray-200 flex flex-col"> {/* Light theme */}
              <SheetHeader className="pb-4 border-b border-gray-200">
                <SheetTitle className="text-[#D81E05] text-2xl font-bold">KRYSTAL STORE</SheetTitle> {/* Krystal Red title */}
                <SheetDescription className="text-gray-600">
                  Shop the latest trends.
                </SheetDescription>
              </SheetHeader>
              <div className="pt-4 pb-6 overflow-y-auto flex-grow"> {/* Added overflow-y-auto */}
                {/* Mobile Search Bar */}
                <div className="relative mb-6">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#D81E05] text-[#222222] placeholder:text-gray-500" 
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4 text-lg font-medium">
                  <Link to="/new-in" onClick={closeSheet} className="block py-2 hover:text-[#D81E05] transition-colors">New In</Link>
                  <Link to="/sale" onClick={closeSheet} className="block py-2 font-bold text-[#D81E05] hover:text-[#222222] transition-colors">Sale</Link>

                  {/* Mobile Categories (adaptive columns) */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-gray-500 text-sm uppercase mb-2">Shop by Category</h3>
                    <div className="flex flex-wrap -mx-1"> {/* Use flex-wrap for adaptive columns */}
                      {mainCategories.map(category => (
                        <Link key={category} to={`/category/${encodeURIComponent(category)}`} onClick={closeSheet}
                          className="flex-grow-0 flex-shrink-0 w-1/2 sm:w-1/2 px-1 mb-2"> {/* Default to 2 columns */}
                          <div className="block py-2 px-3 rounded-md bg-gray-100 hover:bg-[#D81E05] hover:text-white transition-colors text-base text-[#222222] text-center">
                            {category}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link to="/contact" onClick={closeSheet} className="block py-2 border-t border-gray-200 pt-4 mt-4 hover:text-[#D81E05] transition-colors">Contact</Link>
                </nav>
              </div>

              {/* Mobile Action Icons (Optional, simplified) */}
              <div className="mt-auto pt-6 border-t border-gray-200 flex justify-around items-center">
                {/* Cart always visible */}
                <Button variant="ghost" size="icon" className="text-[#222222] hover:bg-gray-100" asChild>
                  <Link to="/cart" onClick={closeSheet}>
                    <ShoppingCart className="h-6 w-6" />
                    <span className="sr-only">Cart</span>
                  </Link>
                </Button>
                {/* Profile dropdown for mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-[#222222] hover:bg-gray-100">
                      <User className="h-6 w-6" />
                      <span className="sr-only">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white text-[#222222] rounded-md shadow-lg z-50">
                    {isLoggedIn ? (
                      <>
                        <DropdownMenuLabel className="text-[#D81E05]">{userName}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <DropdownMenuItem asChild>
                          <Link to="/account" onClick={closeSheet} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                            <UserCircle className="h-4 w-4" /> My Account
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/orders" onClick={closeSheet} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                            <Package className="h-4 w-4" /> Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/wishlist" onClick={closeSheet} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                            <Heart className="h-4 w-4" /> Wishlist
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500 hover:bg-red-50 py-2 px-2 rounded-md">
                          <LogOut className="h-4 w-4" /> Logout
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={handleLoginRedirect} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                        <LogIn className="h-4 w-4" /> Login
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center flex-shrink-0 lg:flex-row">
            <span className="font-extrabold text-3xl lg:text-3xl text-white tracking-wider leading-none">KRYSTAL</span>
            <span className="font-normal text-sm lg:text-base text-white -mt-1 lg:ml-1 lg:mt-0 font-serif">STORE</span> {/* Different font-family for 'STORE' */}
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="flex-grow max-w-xl hidden lg:block relative">
            <Input
              type="search"
              placeholder="Search for products, categories, brands..."
              className="w-full pl-10 pr-4 rounded-full bg-white bg-opacity-90 border-none focus:ring-2 focus:ring-[#D81E05] text-[#222222] placeholder:text-gray-500" // Light theme
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
                  Categories <Menu className="h-4 w-4" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[600px] p-4 bg-white text-[#222222] rounded-md shadow-lg z-20 border border-gray-200"> {/* Light theme */}
                <DropdownMenuLabel className="text-[#D81E05] text-lg mb-3">Shop by Category</DropdownMenuLabel> {/* Krystal Red label */}
                <DropdownMenuSeparator className="bg-gray-200 mb-3" /> {/* Light theme separator */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
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

          {/* Action Icons (Desktop & Mobile) */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Icon (Desktop only, already hidden on mobile by lg:hidden) */}
            <Button variant="ghost" size="icon" className="hidden lg:flex text-white hover:bg-[#A01A04]">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Wishlist Icon (Desktop only) */}
            <Button variant="ghost" size="icon" className="hidden lg:flex text-white hover:bg-[#A01A04]" asChild>
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            {/* Cart Icon (Always visible) */}
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>

            {/* User/Profile Icon with Dropdown (Always visible) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white text-[#222222] rounded-md shadow-lg z-50 border border-gray-200"> {/* Light theme */}
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="text-[#D81E05]">Hi, {userName}</DropdownMenuLabel> {/* Krystal Red label */}
                    <DropdownMenuSeparator className="bg-gray-200" /> {/* Light theme separator */}
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                        <UserCircle className="h-4 w-4" /> My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                        <Package className="h-4 w-4" /> Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="lg:hidden"> {/* Wishlist visible on desktop, hidden on mobile in main nav, shown here */}
                      <Link to="/wishlist" className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                        <Heart className="h-4 w-4" /> Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500 hover:bg-red-50 py-2 px-2 rounded-md">
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleLoginRedirect} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-2 rounded-md">
                    <LogIn className="h-4 w-4" /> Login
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

