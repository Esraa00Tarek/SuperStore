import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Package, Layers, Tag, MessageSquare, MessageCircle, User, Menu, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { currentUser, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navigation = [
    { name: t('Products') || 'Products', href: '/admin/products', icon: <Package className="h-5 w-5" /> },
    { name: t('Handmade Crafts') || 'Handmade Crafts', href: '/admin/crafts', icon: <Layers className="h-5 w-5" /> },
    { name: t('Categories') || 'Categories', href: '/admin/categories', icon: <Tag className="h-5 w-5" /> },
    { name: t('Contact') || 'Contact', href: '/admin/contacts', icon: <MessageSquare className="h-5 w-5" /> },
    { name: t('WhatsApp Settings') || 'WhatsApp Settings', href: '/admin/whatsapp', icon: <MessageCircle className="h-5 w-5" /> },
    { name: t('Profile') || 'Profile', href: '/admin/profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 flex ${isRTL ? 'flex-row-reverse' : ''} relative`}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          'fixed top-0 h-full bg-primary text-white transition-all duration-300 ease-in-out z-50 shadow-lg flex flex-col',
          isRTL ? 'right-0' : 'left-0',
          sidebarOpen ? 'w-64' : 'w-20',
          isMobile && !sidebarOpen && 'hidden'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-600 flex-shrink-0">
          <div className="flex items-center">
            {sidebarOpen ? <h1 className="text-xl font-bold text-white">SuperStore</h1> : (
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-primary font-bold">SS</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isMobile && (
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-primary-600 lg:hidden">
                <X className="h-5 w-5 text-white" />
              </button>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-md hover:bg-primary-600 hidden lg:block">
              <ChevronRight 
                className={`h-5 w-5 text-white transition-transform duration-300 ${isRTL ? (sidebarOpen ? 'rotate-0' : 'rotate-180') : (sidebarOpen ? 'rotate-180' : 'rotate-0')}`} 
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigation.map(item => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200',
                    location.pathname === item.href ? 'bg-white/10 text-white shadow-md' : 'text-primary-50 hover:bg-primary-700/80',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-primary-600">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-500 flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-medium">{currentUser?.email?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{currentUser?.email || 'User'}</p>
                <button onClick={handleLogout} className="text-xs text-primary-200 hover:text-white flex items-center mt-1 transition-colors">
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  {t('auth.logout') || 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen',
        !isMobile && sidebarOpen ? (isRTL ? 'mr-64' : 'ml-64') : '',
        !isMobile && !sidebarOpen ? (isRTL ? 'mr-20' : 'ml-20') : '',
        'bg-gray-50'
      )}>
        {/* Top Navigation */}
        <div className="sticky top-0 z-30">
          <div className="bg-primary text-white shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:text-gray-100 focus:outline-none lg:hidden">
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-medium text-white truncate">{navigation.find(nav => nav.href === location.pathname)?.name || 'Products'}</h1>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={handleLogout} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors">
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{t('auth.logout') || 'Logout'}</span>
                </button>
              </div>
            </div>
            <div className="h-0.5 bg-white/20 w-full"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
