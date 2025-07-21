import { useState } from "react";
import { AuthLayout } from "@/components/AdminComponents/AuthLayout";
import { DashboardLayout } from "@/components/AdminComponents/DashboardLayout";
import { DashboardHome } from "@/components/AdminComponents/DashboardHome";
import { ProductUpload } from "@/components/AdminComponents/ProductUpload";
import { MyProducts } from "@/components/AdminComponents/MyProducts";
import { Profile } from "@/components/AdminComponents/Profile";

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
