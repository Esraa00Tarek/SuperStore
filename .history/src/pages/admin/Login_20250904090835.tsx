import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Login() {
  const { isRTL, t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin/products";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!identifier || !password) {
      setError(isRTL ? 'الرجاء ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Use the enhanced login with persistence
      await login(identifier, password, rememberMe ? 'local' : 'session');
      
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
      
      // Navigate to the intended destination or fallback to products
      const redirectPath = from?.pathname || '/admin/products';
      navigate(redirectPath, { replace: true });
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-xl">
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
            <h1 className="text-2xl font-bold">
              {isRTL ? 'مرحباً بك في لوحة التحكم' : 'Welcome to the Admin Dashboard'}
            </h1>
          </div>
          
          <CardContent className="p-10">
            {error && (
              <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="identifier" className="text-gray-700">
                  {isRTL ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or Username'}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    autoComplete="username"
                    className="pl-10 py-5 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني أو اسم المستخدم' : 'Enter your email or username'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-gray-700">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pl-10 pr-10 w-full"
                    placeholder={isRTL ? '••••••••' : '••••••••'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label 
                    htmlFor="remember-me" 
                    className={`${isRTL ? 'mr-2' : 'ml-2'} block text-sm text-gray-700`}
                  >
                    {isRTL ? 'تذكرني' : 'Remember me'}
                  </label>
                </div>
                <Link 
                  to="/admin/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 px-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-100 ${
                isLoading ? 'opacity-90 cursor-wait' : ''
              }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="relative">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                      </div>
                    </div>
                    <span className="font-medium">
                      {isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                    </span>
                  </div>
                ) : (
                  <>{isRTL ? 'تسجيل الدخول' : 'Sign in'}</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
