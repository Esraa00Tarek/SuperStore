import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';

interface UserProfile {
  username: string;
  email: string;
  uid: string;
  [key: string]: unknown;
}

// Utility function to convert string to Title Case and remove dots
function formatText(text: string) {
  if (!text) return '';
  return text
    .replace(/\./g, ' ') // remove dots and replace with space
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function Profile() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { currentUser, auth } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ username: string; email: string }>({
    username: '',
    email: ''
  });
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setFormData({
            username: userData.username || '',
            email: userData.email || currentUser.email || ''
          });
          return;
        }

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data() as UserProfile;

          await updateDoc(doc(db, 'users', userDoc.id), { uid: currentUser.uid });

          setFormData({
            username: userData.username || '',
            email: userData.email || currentUser.email || ''
          });
        } else {
          const username =
            currentUser.email?.split('@')[0] ||
            `user${Math.random().toString(36).substr(2, 8)}`;

          const newUserData: UserProfile = {
            uid: currentUser.uid,
            username,
            email: currentUser.email || ''
          };

          await setDoc(doc(db, 'users', currentUser.uid), newUserData);
          setFormData(newUserData);

          toast({
            title: formatText('Profile Created'),
            description: formatText('Your profile has been created successfully!'),
            variant: 'default'
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: formatText('Error'),
          description: formatText('Failed to load user data'),
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, toast]);

  // Save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = formatText('Username is required');
    if (!formData.email.trim()) newErrors.email = formatText('Email is required');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = formatText('Invalid email');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        username: formData.username,
        email: formData.email,
        updatedAt: new Date().toISOString()
      });

      toast({
        title: formatText('Success'),
        description: formatText('Profile updated successfully'),
        variant: 'default'
      });

      setIsEditing(false);
      setErrors({});
    } catch (error) {
      toast({
        title: formatText('Error'),
        description: formatText('Failed to update profile'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !auth.currentUser) return;

    const newErrors: Record<string, string> = {};
    if (!currentPassword) newErrors.currentPassword = formatText('Current password required');
    if (!newPassword) newErrors.newPassword = formatText('New password required');
    if (newPassword.length < 6) newErrors.newPassword = formatText('Password must be at least 6 chars');
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = formatText('Passwords do not match');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      toast({
        title: formatText('Password Updated'),
        description: formatText('Your password has been changed successfully'),
        variant: 'default'
      });

      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (error: unknown) {
      toast({
        title: formatText('Error'),
        description: formatText(error instanceof Error ? error.message : 'Failed to update password'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label htmlFor="username">{formatText(t('profile.username') || 'Username')}</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
                placeholder={formatText(t('profile.enterName') || 'Enter your name')}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>

            <div>
              <Label htmlFor="email">{formatText(t('profile.email') || 'Email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                placeholder={formatText(t('profile.enterEmail') || 'Enter your email')}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {isEditing ? (
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? formatText(t('profile.saving') || 'Saving...') : formatText(t('profile.saveChanges') || 'Save Changes')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                  }}
                  disabled={loading}
                >
                  {formatText(t('profile.cancel') || 'Cancel')}
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                {formatText(t('profile.editProfile') || 'Edit Profile')}
              </Button>
            )}
          </form>

          {/* Password change section */}
          <div className="border-t mt-8 pt-6">
            <h3 className="text-lg font-medium mb-4">{formatText(t('profile.changePassword') || 'Change Password')}</h3>
            {isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">{formatText(t('profile.currentPassword') || 'Current Password')}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={formatText(t('profile.enterCurrentPassword') || 'Enter current password')}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword">{formatText(t('profile.newPassword') || 'New Password')}</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                      placeholder={formatText(t('profile.enterNewPassword') || 'Enter new password')}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">{formatText(t('profile.confirmPassword') || 'Confirm Password')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      placeholder={formatText(t('profile.enterConfirmPassword') || 'Confirm your password')}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? formatText(t('profile.updating') || 'Updating...') : formatText(t('profile.updatePassword') || 'Update Password')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setErrors({});
                    }}
                    disabled={loading}
                  >
                    {formatText(t('profile.cancel') || 'Cancel')}
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(true)}
                disabled={isEditing}
              >
                {formatText(t('profile.changePassword') || 'Change Password')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
