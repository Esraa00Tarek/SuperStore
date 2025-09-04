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

export default function ForgotPassword() {
  const { t } = useLanguage();
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
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] p-4 sm:p-6 lg:p-8">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl overflow-hidden bg-white">
          <div className="bg-[#f7f7f7] p-6 text-center border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary">
              {t('auth.forgotPassword') || 'Forgot your password?'}
            </h1>
            <p className="mt-2 text-gray-500">
              {t('auth.enterEmailForReset') || 'Enter your email address and we\'ll send you a link to reset your password.'}
            </p>
          </div>
          <CardContent className="p-6">
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
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {t('auth.backToLogin') || 'Back to login'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="mr-2 h-4 w-4" />
                      {t('auth.email') || 'Email address'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full py-4 rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {error && (
                    <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
                      {error}
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-md"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('auth.sending') || 'Sending...'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Mail className="mr-2 h-4 w-4" />
                        {t('auth.sendResetLink') || 'Send Reset Link'}
                      </span>
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  <Link 
                    to="/login" 
                    className="font-medium text-primary hover:text-primary/80 flex items-center justify-center"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    {t('auth.backToLogin') || 'Back to login'}
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
