import { useState } from "react";
import { AuthLayout } from "@/components/AuthLayout";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHome } from "@/components/DashboardHome";
import { ProductUpload } from "@/components/ProductUpload";
import { MyProducts } from "@/components/MyProducts";
import { Profile } from "@/components/Profile";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userData, setUserData] = useState({ name: "", email: "", role: "" });

  const handleAuthenticated = (data: { name: string; email: string; role: string }) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData({ name: "", email: "", role: "" });
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome onPageChange={setCurrentPage} />;
      case "add-product":
        return <ProductUpload />;
      case "my-products":
        return <MyProducts />;
      case "profile":
        return <Profile userData={userData} />;
      default:
        return <DashboardHome onPageChange={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <AuthLayout onAuthenticated={handleAuthenticated} />;
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={handleLogout}
      userData={userData}
    >
      {renderPage()}
    </DashboardLayout>
  );
};

export default Index;
