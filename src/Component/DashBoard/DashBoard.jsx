import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { useQuery } from "@tanstack/react-query";
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Settings, 
  BookOpen, 
  Users, 
  BarChart3, 
  CreditCard,
  FileText,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Video,
  ShoppingCart,
  Award
} from 'lucide-react';
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DashBoard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch additional user info from your backend
  const { data: userInfo = {}, isLoading, isError } = useQuery({
    queryKey: ["userInfo", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Get current user role from userInfo or fallback to 'user'
  const userRole = userInfo?.role || 'user';

  // Admin specific links
  const adminLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard/admin/courses', label: 'Manage Courses', icon: BookOpen },
    { path: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
    { path: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/dashboard/admin/reports', label: 'Reports', icon: FileText },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  // User specific links
  const userLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard/my-courses', label: 'My Courses', icon: Video },
    { path: '/dashboard/enrollments', label: 'Enrollments', icon: ShoppingCart },
    { path: '/dashboard/progress', label: 'Progress', icon: BarChart3 },
    { path: '/dashboard/certificates', label: 'Certificates', icon: Award },
    { path: '/dashboard/support', label: 'Support', icon: MessageSquare },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  // Get links based on user role
  const currentLinks = userRole === 'admin' ? adminLinks : userLinks;

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleMobileDrawer = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Failed to load user info</p>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileDrawer}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0  bg-opacity-50 z-40"
          onClick={toggleMobileDrawer}
        />
      )}

      {/* Sidebar/Drawer */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDrawerOpen ? 'w-64' : 'w-20'}
        lg:translate-x-0
      `}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {isDrawerOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {userInfo?.name?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {userInfo?.name || user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  userRole === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userRole}
                </span>
              </div>
            </div>
          )}
          
          {/* Close/Open Button - Hidden only on mobile devices */}
          {!isMobile && (
            <button
              onClick={toggleDrawer}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isDrawerOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {currentLinks.map((link) => {
            const IconComponent = link.icon;
            const isActive = isActiveLink(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                {isDrawerOpen && (
                  <span className="font-medium whitespace-nowrap">{link.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5" />
            {isDrawerOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoard;