import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { cn } from '@/lib/utils';

export default function ForgotPassword() {
  const { t, isRTL } = useLanguage();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError(t('auth.fillAllFields') || 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
      toast({
        title: 'Forgot Your Password',
        description: 'Please check your inbox for the password reset link.',
      });
    } catch (err: unknown) {
      console.error('Password reset error:', err);
      setError((err as Error).message || t('auth.resetFailed') || 'Failed to send password reset email');
      toast({
        title: t('auth.error') || 'Error',
        description: error || t('auth.resetFailed') || 'Failed to send password reset email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-primary p-6">
            <Link 
              to="/admin/login" 
              className={cn(
                "inline-flex items-center text-sm font-medium text-primary-100 hover:text-white mb-4 w-fit",
                isRTL ? 'flex-row-reverse' : ''
              )}
            >
              <ArrowLeft className={cn("h-4 w-4", isRTL ? 'ml-1' : 'mr-1')} />
              {isRTL ? 'العودة لتسجيل الدخول' : 'Back to login'}
            </Link>
            <CardTitle className="text-2xl font-bold text-white">
              {isRTL ? 'نسيت كلمة المرور' : 'Forgot Password'}
            </CardTitle>
            <CardDescription className="text-primary-100 mt-1">
              {isRTL 
                ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.'
                : 'Enter your email and we\'ll send you a link to reset your password.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8">
            {resetSent ? (
              <div className="text-center space-y-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('auth.checkYourEmail') || 'Check your email'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('auth.resetLinkSent') || 'We\'ve sent a password reset link to your email address.'}
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {t('auth.backToLogin') || 'Back to login'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {isRTL ? 'البريد الإلكتروني' : 'Email address'}
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={cn(
                        'pl-10 h-11 text-base border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                        isRTL ? 'pr-3' : 'pl-10'
                      )}
                      placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium text-white bg-primary hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-medium">
                          {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                        </span>
                      </span>
                    ) : (
                      <span>{isRTL ? 'إرسال رابط إعادة التعيين' : 'Send reset link'}</span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
