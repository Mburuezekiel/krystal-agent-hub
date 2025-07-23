import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Package, 
  Settings, 
  FileText, 
  MessageSquare, 
  BarChart3,
  Bell,
  HelpCircle,
  Activity,
  DollarSign,
  Shield,
  Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const adminNavItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/agents', icon: UserCheck, label: 'Agent Approval' },
    { path: '/admin/products', icon: Package, label: 'Product Moderation' },
    { path: '/admin/categories', icon: Tag, label: 'Category Management' },
    { path: '/admin/transactions', icon: DollarSign, label: 'Transaction Logs' },
    { path: '/admin/system-logs', icon: Shield, label: 'System Logs' },
    { path: '/admin/broadcast', icon: MessageSquare, label: 'Broadcast Messaging' },
    { path: '/admin/settings', icon: Settings, label: 'Global Settings' },
  ];

  const agentNavItems = [
    { path: '/agent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/agent/products', icon: Package, label: 'Product Management' },
    { path: '/agent/analytics', icon: BarChart3, label: 'Analytics & Metrics' },
    { path: '/agent/profile', icon: Users, label: 'Agent Profile' },
    { path: '/agent/activity', icon: Activity, label: 'Activity Log' },
  ];

  const sharedNavItems = [
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/support', icon: HelpCircle, label: 'Support' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : agentNavItems;

  return (
    <div className="h-full w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-red-500">Krystal Traders</h1>
        <p className="text-sm text-gray-400 capitalize">{user?.role} Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-red-600 text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Shared Navigation */}
        <div className="pt-4 border-t border-gray-700 mt-4">
          {sharedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "bg-red-600 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;