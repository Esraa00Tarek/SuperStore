import { User, Package, HandCoins, LogOut, Home, MessageCircle, Tags, Contact } from 'lucide-react';
import WhatsAppButtonManager from '@/components/admin/WhatsAppButtonManager';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

// Types
type TabType = 'profile' | 'products' | 'crafts' | 'whatsapp' | 'categories' | 'contact';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from current path
  const getActiveTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('/admin/products')) return 'products';
    if (path.includes('/admin/crafts')) return 'crafts';
    if (path.includes('/admin/categories')) return 'categories';
    if (path.includes('/admin/contacts')) return 'contact';
    if (path.includes('/admin/whatsapp')) return 'whatsapp';
    if (path.includes('/admin/profile')) return 'profile';
    return 'profile'; // Default tab
  };

  const activeTab = getActiveTab();
  
  const tabs: TabConfig[] = [
    { 
      id: 'profile', 
      label: t('dashboard.tabs.profile') || 'Profile', 
      icon: User,
      path: '/admin/profile'
    },
    { 
      id: 'products', 
      label: t('dashboard.tabs.products') || 'Products', 
      icon: Package,
      path: '/admin/products'
    },
    { 
      id: 'categories', 
      label: t('dashboard.tabs.categories') || 'Categories', 
      icon: Tags,
      path: '/admin/categories'
    },
    { 
      id: 'crafts', 
      label: t('dashboard.tabs.crafts') || 'Handmade Crafts', 
      icon: HandCoins,
      path: '/admin/crafts'
    },
    { 
      id: 'contact', 
      label: t('dashboard.tabs.contact') || 'Contact Info', 
      icon: Contact,
      path: '/admin/contacts'
    },
    { 
      id: 'whatsapp', 
      label: t('dashboard.tabs.whatsapp') || 'WhatsApp Numbers', 
      icon: MessageCircle,
      path: '/admin/whatsapp'
    },
  ];



  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/admin/login');
  };

  const handleSaveWhatsAppNumbers = (productsNumber: string, craftsNumber: string) => {
    // Save to localStorage
    localStorage.setItem('whatsappNumbers', JSON.stringify({
      products: productsNumber,
      crafts: craftsNumber
    }));
  };

  // Load saved numbers from localStorage or use empty strings as defaults
  const loadWhatsAppNumbers = () => {
    try {
      const saved = localStorage.getItem('whatsappNumbers');
      if (saved) {
        const { products, crafts } = JSON.parse(saved);
        return { products, crafts };
      }
    } catch (e) {
      console.error('Failed to load WhatsApp numbers', e);
    }
    return { products: '', crafts: '' };
  };

  const { products: productsNumber, crafts: craftsNumber } = loadWhatsAppNumbers();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-30 shadow-lg h-16">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">{t('dashboard.title') || 'Dashboard'}</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-1 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              {t('nav.home') || 'Home'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout') || 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-gray-800 text-white shadow-lg overflow-y-auto">
          <nav className="py-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-700 transition-colors ${
                    activeTab === tab.id ? 'bg-gray-700 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {activeTab === 'whatsapp' ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    {t('dashboard.whatsappNumbers') || 'WhatsApp Numbers'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('dashboard.whatsappNumbersDesc') || 'Manage the WhatsApp contact numbers for products and crafts inquiries'}
                  </p>
                </div>
                <WhatsAppButtonManager 
                  initialProductsNumber={productsNumber}
                  initialCraftsNumber={craftsNumber}
                  onSaveNumbers={handleSaveWhatsAppNumbers}
                />
              </div>
            ) : (
              children || <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
