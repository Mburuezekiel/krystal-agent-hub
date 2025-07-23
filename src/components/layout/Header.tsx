// src/components/layout/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirects
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, User, Search, Menu, X, Phone, Mail, Instagram, Facebook, LogIn, LogOut, Package, UserCircle, Music2Icon } from 'lucide-react'; // Music2Icon is now imported directly
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ALL_CATEGORIES } from '@/services/product-service';

const Header: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Default to false, will be set from localStorage
  const [userName, setUserName] = React.useState(""); // Default to empty, will be set from localStorage
  const navigate = useNavigate(); // Hook for navigation

  // Fetch auth state from localStorage on mount
  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    const storedUserName = localStorage.getItem('userName'); // This should store the FIRST name
    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, []); // Empty dependency array means this runs once on mount

  // Filter out "New In" and "Sale" as they have dedicated sections/routes
  const mainCategories = ALL_CATEGORIES.filter(
    (cat) => cat !== "New In" && cat !== "Sale"
  );

  // Function to close the sheet
  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Remove token from localStorage
    localStorage.removeItem('userName'); // Remove user name from localStorage
    setIsLoggedIn(false); // Update local state
    setUserName(""); // Update local state
    closeSheet(); // Close the mobile sheet if open
    navigate('/login'); // Redirect to login page
  };

  const handleLoginRedirect = () => {
    closeSheet(); // Close the mobile sheet if open
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Contact & Socials Bar - Hidden on small screens (md:flex means visible from md breakpoint up) */}
      <div className="hidden md:flex bg-[#F8F8F8] text-[#222222] text-xs py-2 px-4 items-center justify-between gap-2 border-b border-gray-200">
        {/* Left Section: Contact Details */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-[#D81E05]" />
            <a href="tel:+254712345678" className="hover:text-[#D81E05] transition-colors">
              +254 712 345 678
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-[#D81E05]" />
            <a href="mailto:support@krystalstore.com" className="hover:text-[#D81E05] transition-colors">
              support@krystalstore.com
            </a>
          </div>
        </div>

        {/* Right Section: Social Icons */}
        <div className="flex items-center gap-3">
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

      
      {/* Main Header */}
      <div className="bg-[#D81E05] shadow-md border-b border-[#A01A04]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle (Sheet Trigger) - Visible only on small screens */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-[#A01A04]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px] bg-white text-[#222222] border-r border-gray-200 flex flex-col">
              <SheetHeader className="pb-4 border-b border-gray-200">
                <SheetTitle className="text-[#D81E05] text-2xl font-bold">KRYSTAL STORE</SheetTitle>
                <SheetDescription className="text-gray-600">
                  Shop the latest trends.
                </SheetDescription>
              </SheetHeader>
              <div className="pt-4 pb-6 overflow-y-auto flex-grow">
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

                  {/* Mobile Categories (consistent 2 columns) */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-gray-500 text-sm uppercase mb-2">Shop by Category</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {mainCategories.map(category => (
                        <Link key={category} to={`/category/${encodeURIComponent(category)}`} onClick={closeSheet}
                          className="block px-2 py-2 rounded-md bg-gray-100 text-[#222222] text-center text-base hover:bg-[#D81E05] hover:text-white transition-colors">
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link to="/contact" onClick={closeSheet} className="block py-2 border-t border-gray-200 pt-4 mt-4 hover:text-[#D81E05] transition-colors">Contact</Link>
                </nav>
              </div>

              {/* Mobile Action Icons (Cart & Profile only) */}
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
                  <DropdownMenuContent className="w-48 bg-white text-[#222222] rounded-md shadow-lg z-50 border border-gray-200">
                    {isLoggedIn ? (
                      <>
                        <DropdownMenuLabel className="text-[#D81E05]">Hi, {userName}</DropdownMenuLabel>
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
                        <DropdownMenuItem asChild> {/* Wishlist for mobile profile dropdown */}
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
          {/* On small screens, logo is between menu toggle and action icons */}
          <Link to="/" className="flex flex-col items-center flex-grow flex-shrink-0 lg:flex-row lg:flex-grow-0">
            <span className="font-extrabold text-2xl sm:text-3xl lg:text-3xl text-white tracking-wider leading-none">KRYSTAL</span>
            <span className="font-normal text-xs sm:text-sm lg:text-base text-white -mt-1 lg:ml-1 lg:mt-0 font-serif">STORE</span>
          </Link>

          {/* Search Bar (Desktop) - Hidden on mobile */}
          <div className="flex-grow max-w-xl hidden lg:block relative">
            <Input
              type="search"
              placeholder="Search for products, categories, brands..."
              className="w-full pl-10 pr-4 rounded-full bg-white bg-opacity-90 border-none focus:ring-2 focus:ring-[#D81E05] text-[#222222] placeholder:text-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5" />
          </div>

          {/* Navigation Links (Desktop) - Hidden on mobile */}
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
              <DropdownMenuContent className="w-[600px] p-4 bg-white text-[#222222] rounded-md shadow-lg z-20 border border-gray-200">
                <DropdownMenuLabel className="text-[#D81E05] text-lg mb-3">Shop by Category</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 mb-3" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                  {mainCategories.map(category => (
                    <DropdownMenuItem asChild key={category} className="p-0 focus:bg-transparent">
                      <Link to={`/category/${encodeURIComponent(category)}`} className="block px-3 py-2 rounded-md text-base hover:bg-[#D81E05] hover:text-white transition-colors">
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
            {/* Search Icon (Desktop only) */}
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
                {/* Changed: Display First Name next to User icon when logged in */}
                <Button variant="ghost" className="text-white hover:bg-[#A01A04] flex items-center px-2 py-1 rounded-md">
                  <User className="h-5 w-5" />
                  {isLoggedIn && <span className="ml-2 hidden sm:inline-block text-sm font-medium">{userName}</span>}
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white text-[#222222] rounded-md shadow-lg z-50 border border-gray-200">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel className="text-[#D81E05]">Hi, {userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200" />
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
                    <DropdownMenuItem asChild> {/* Wishlist for mobile profile dropdown */}
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
