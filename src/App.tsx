// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Main Homepage
import HomePage from "./pages/landing/Index"; // Corrected path for HomePage

// Admin Page (from your existing code)
import AgentDash from "./pages/Admin/Index";

// Placeholder Pages (newly added)
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import CategoryPage from "./pages/Product/CategoryPage";
import NewArrivalsPage from "./pages/Product/NewArrivalsPage";
import SalePage from "./pages/Product/SalePage";
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
import NotFoundPage from "./pages/NotFound"; // Corrected import for NotFound page


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Header and Footer are placed outside <Routes> so they appear on all pages */}
        <Header/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/agent/dashboard" element={<AgentDash />} />

          {/* E-commerce Specific Pages */}
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/new-in" element={<NewArrivalsPage />} />
          <Route path="/sale" element={<SalePage />} />
           <Route path="/cart" element={<CartPage />} />       
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />

          {/* Catch-all route for 404 - make sure this is the last route */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
        <Footer/>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

