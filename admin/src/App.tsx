import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AgentDashboard from './pages/agent/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AgentApproval from './pages/admin/AgentApproval';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isLoggedIn, user } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/agents" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AgentApproval />
          </ProtectedRoute>
        } />
        
        {/* Agent Routes */}
        <Route path="/agent/dashboard" element={
          <ProtectedRoute allowedRoles={['agent', 'admin']}>
            <AgentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<div className="p-6">Page not found</div>} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;