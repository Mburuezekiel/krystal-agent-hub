import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart, Heart, User, Search, Menu, X, Phone, Mail, Instagram, Facebook, LogIn, LogOut, Package, UserCircle, Music2Icon, Home, LayoutList // Import Home and LayoutList for bottom nav
} from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // State for header visibility
  const [lastScrollY, setLastScrollY] = useState(0); // State to track last scroll position
  const navigate = useNavigate();
  const { isLoggedIn, userName, logout } = useAuth();

  const mainCategories = ALL_CATEGORIES.filter(
    (cat) => cat !== "New In" && cat !== "Sale"
  );

  const closeSheet = () => setIsSheetOpen(false);

  const handleLogout = () => {
    logout();
    closeSheet();
    navigate('/login');
  };

  const handleLoginRedirect = () => {
    closeSheet();
    navigate('/login');
  };

  // Effect for hiding/showing header on scroll for large screens
  useEffect(() => {
    const handleScroll = () => {
      // Only apply this logic on large screens (lg breakpoint)
      if (window.innerWidth >= 1024) { // Tailwind's 'lg' breakpoint
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // Scrolling down and past a threshold
          setIsHeaderVisible(false);
        } else { // Scrolling up or near the top
          setIsHeaderVisible(true);
        }
        setLastScrollY(window.scrollY);
      } else {
        setIsHeaderVisible(true); // Always visible on small screens (handled by different layout)
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);


  return (
    <>
      {/* Top Contact & Socials Bar - Hidden on small screens */}
      <div className="hidden md:flex bg-[#F8F8F8] text-[#222222] text-xs py-2 px-4 items-center justify-between gap-2 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-[#D81E05]" />
            <a href="tel:+254700282618" className="hover:text-[#D81E05] transition-colors">
              +254 700 282 618
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-[#D81E05]" />
            <a href="mailto:support@krystaltraders.com" className="hover:text-[#D81E05] transition-colors">
              support@krystaltraders.com
            </a>
          </div>
        </div>
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

      {/* Mobile Top Bar (Search Only) - Visible on small screens, hidden on large */}
<div className="lg:hidden bg-white shadow-sm sticky top-0 z-40 p-3">
  <div className="flex items-center"> {/* Removed container mx-auto */}
    <div className="flex-grow relative">
      <Input
        type="search"
        placeholder="Search Krystal..."
        className="w-full pl-10 pr-4 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-[#FFD700] text-gray-800 placeholder:text-gray-500 text-base"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
    </div>
  </div>
</div>

      {/* Main Header (Desktop) - Hidden on mobile */}
      <header
        className={`w-full sticky top-0 z-50 transform transition-transform duration-300 hidden lg:block ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="bg-[#D81E05] shadow-md border-b border-[#A01A04]">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-center flex-grow flex-shrink-0 lg:flex-row lg:flex-grow-0">
              <span className="font-extrabold text-2xl sm:text-3xl lg:text-3xl text-white tracking-wider leading-none">KRYSTAL</span>
              <span className="font-normal text-xs sm:text-sm lg:text-base text-white -mt-1 lg:ml-1 lg:mt-0 font-serif">TRADERS</span>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="flex-grow max-w-xl relative">
              <Input
                type="search"
                placeholder="Search for products, categories, brands..."
                className="w-full pl-10 pr-4 rounded-full bg-white bg-opacity-90 border-none focus:ring-2 focus:ring-[#FFD700] text-[#222222] placeholder:text-gray-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5" />
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="flex items-center gap-6 text-sm font-medium">
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

            {/* Action Icons (Desktop) */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]" asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="text-white hover:bg-[#A01A04]" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
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
                      <DropdownMenuItem asChild>
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

      {/* Bottom Navigation Bar - Visible on small screens, hidden on large */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 lg:hidden shadow-lg">
        <div className="flex justify-around items-center h-14">
          <Link to="/" className="flex flex-col items-center justify-center text-[#222222] hover:text-[#D81E05] transition-colors text-xs font-medium gap-1 px-2 py-1">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/categories" className="flex flex-col items-center justify-center text-[#222222] hover:text-[#D81E05] transition-colors text-xs font-medium gap-1 px-2 py-1">
            <LayoutList className="h-5 w-5" />
            <span>Categories</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center justify-center text-[#222222] hover:text-[#D81E05] transition-colors text-xs font-medium gap-1 px-2 py-1">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center justify-center text-[#222222] hover:text-[#D81E05] transition-colors text-xs font-medium gap-1 px-2 py-1">
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
          </Link>
          {/* Account link in bottom nav now redirects directly to /account */}
          {isLoggedIn ? (
            <Link to="/account" className="flex flex-col items-center justify-center text-[#222222] hover:text-[#D81E05] transition-colors text-xs font-medium gap-1 px-2 py-1">
              <User className="h-5 w-5" />
              <span>Account</span>
            </Link>
          ) : (
            <Link to="/login" className="flex flex-col items-center justify-center text-[#222222] hover:text-[#D81E05] transition-colors text-xs font-medium gap-1 px-2 py-1">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;