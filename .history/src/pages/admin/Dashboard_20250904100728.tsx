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

  // State for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-neutral-800 text-white z-30 shadow-lg h-16">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">{t('dashboard.title') || 'Dashboard'}</h1>
          <div className="flex items-center space-x-4">
            {/* Mobile sidebar toggle */}
            <button
              className="md:hidden flex items-center gap-2 px-3 py-1 text-sm text-white bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              {t('nav.menu') || 'Menu'}
            </button>
            <button
              onClick={() => navigate('/')}
              className="hidden md:flex items-center gap-2 px-3 py-1 text-sm text-white bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              {t('nav.home') || 'Home'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1 text-sm text-red-400 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout') || 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop & Mobile */}
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-neutral-800 text-white shadow-lg overflow-y-auto z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block md:static md:w-64`}>
        <nav className="py-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center space-x-3 px-6 py-3 text-left hover:bg-neutral-700 transition-colors ${
                  activeTab === tab.id ? 'bg-neutral-700 border-r-4 border-primary' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-neutral-100 min-h-[calc(100vh-4rem)]">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
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
  );
};

export default Dashboard;
