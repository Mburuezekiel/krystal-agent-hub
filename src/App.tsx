import React, { useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { useRefreshToken } from "./hooks/useRefreshToken";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/landing/Index";


import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassward";
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import CategoryPage from "./pages/Product/CategoryPage";
import NewArrivalsPage from "./pages/Product/NewArrivalsPage";
import SalePage from "./pages/Product/SalePage";
import WishlistPage from "./pages/Product/WishlistPage";
import ProfilePage from "./pages/Profile/Profile";
import CartPage from "./pages/Cart/CartPage";
import CheckoutPage from "./pages/Cart/CheckoutPage";
import ContactPage from "./pages/contact/ContactPage";
import FAQPage from "./pages/faq/FAQPage";
import ShippingPage from "./pages/shipping/ShippingPage";
import ReturnsPage from "./pages/shipping/ReturnsPage";
import SizeGuidePage from "./pages/guide/SizeGuidePage";
import GiftCardsPage from "./pages/gifts/GiftCardsPage";
import PrivacyPolicyPage from "./pages/policies/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/policies/TermsOfServicePage";
import NotFoundPage from "./pages/NotFound";
import CategoryListPage from "./pages/Product/CategoryList";
import OrdersPage from "./pages/Orders/OrdersPage";

const queryClient = new QueryClient();

const ScrollToTopOnNavigate = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return null;
};

const AppContent = () => {
  useRefreshToken(); // Initialize refresh token logic

  return (
    <>
      <ScrollToTopOnNavigate />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/account" element={<ProfilePage />} />

        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/new-in" element={<NewArrivalsPage />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/orders" element={<OrdersPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/size-guide" element={<SizeGuidePage />} />
        <Route path="/gift-cards" element={<GiftCardsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
