import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Package, HandCoins, User, Home, Tags, Contact } from 'lucide-react';
import { initializeFirestore } from '@/firebase/initFirestore';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminDashboardProps {
  children?: ReactNode;
}

const AdminDashboard = ({ children }: AdminDashboardProps) => {
  const { t } = useLanguage();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState<{ success?: boolean; message?: string; error?: string | null } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: t('dashboard.title') || 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { name: t('products.title') || 'Products', icon: Package, path: '/admin/products' },
    { name: t('crafts.title') || 'Crafts', icon: HandCoins, path: '/admin/crafts' },
    { name: t('categories.title') || 'Categories', icon: Tags, path: '/admin/categories' },
    { name: t('contacts.title') || 'Contacts', icon: Contact, path: '/admin/contacts' },
    { name: t('profile.title') || 'Profile', icon: User, path: '/admin/profile' },
  ];

  const handleInitialize = async () => {
    if (window.confirm('This will initialize your Firestore database with sample data. Continue?')) {
      setIsInitializing(true);
      setInitStatus(null);
      
      try {
        const result = await initializeFirestore();
        setInitStatus({
          success: result.success,
          message: result.message || 'Database initialized successfully!',
          error: result.error
        });
      } catch (error) {
        console.error('Initialization error:', error);
        setInitStatus({
          success: false,
          message: 'Failed to initialize database',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setIsInitializing(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {!children && (location.pathname === '/admin' || location.pathname === '/admin/dashboard') ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to Admin Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {navItems
                  .filter(item => item.path !== '/admin/dashboard')
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="ml-4 text-lg font-medium text-gray-900">{item.name}</h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Manage your {item.name.toLowerCase()} and settings
                      </p>
                    </Link>
                  ))}
              </div>

              <div className="mt-8 w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Database Setup</h2>
                <p className="text-gray-600 mb-6">
                  Click the button below to initialize your Firestore database with sample data including categories and a sample product.
                </p>
                
                <Button 
                  onClick={handleInitialize} 
                  disabled={isInitializing}
                  className="w-full"
                >
                  {isInitializing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    'Initialize Database'
                  )}
                </Button>

                {initStatus && (
                  <div className="mt-4">
                    {initStatus.success ? (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription className="text-green-700">
                          {initStatus.message}
                        </AlertDescription>
                      </Alert>
                    ) : initStatus.error ? (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {initStatus.message}: {initStatus.error}
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                )}
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
