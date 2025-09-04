import { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-primary p-6 text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {isRTL ? 'مرحباً بك في لوحة التحكم' : 'Welcome to Admin Dashboard'}
            </CardTitle>
            <CardDescription className="text-primary-100">
              {isRTL ? 'الرجاء تسجيل الدخول للمتابعة' : 'Please sign in to continue'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
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
                    className={cn(
                      'pl-10 h-11 text-base border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                      isRTL ? 'pr-3' : 'pl-10'
                    )}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني أو اسم المستخدم' : 'Enter your email or username'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    {isRTL ? 'كلمة المرور' : 'Password'}
                  </Label>
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className={cn(
                      'pl-10 pr-10 h-11 text-base border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                      isRTL ? 'pr-10 pl-3' : 'pl-10 pr-10'
                    )}
                    placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
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
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    {isRTL ? 'تذكرني' : 'Remember me'}
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium text-white bg-primary hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium">
                        {isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                      </span>
                    </span>
                  ) : (
                    <span>{isRTL ? 'تسجيل الدخول' : 'Sign in'}</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
