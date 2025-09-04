import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { db } from '@/firebase/config';
import { useSettingsMigration } from '@/hooks/useSettingsMigration';
import PhoneInput from '@/components/common/PhoneInput';

// Hook to get WhatsApp numbers
export const useWhatsAppNumbers = (type: 'products' | 'crafts' = 'products') => {
  const [number, setNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadWhatsAppNumber = async () => {
      try {
        const { doc, getDoc, onSnapshot } = await import('firebase/firestore');
        const docRef = doc(db, 'whatsapp', 'numbers');
        
        // First load the current data
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNumber(docSnap.data()[type] || '');
        }
        
        // Then set up real-time listener
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setNumber(doc.data()[type] || '');
          }
          setIsLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading WhatsApp number:', error);
        toast({
          title: t('common.error') || 'Error',
          description: t('errorLoadingNumber') || 'Failed to load WhatsApp number.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    loadWhatsAppNumber();
  }, [type, t]);

  const updateNumber = async (newNumber: string) => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      // Use a single document for all WhatsApp numbers
      const docRef = doc(db, 'whatsapp', 'numbers');
      await setDoc(docRef, { [type]: newNumber }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating WhatsApp number:', error);
      toast({
        title: t('common.error') || 'Error',
  description: t('errorSavingNumber') || 'Failed to save WhatsApp number.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { number, updateNumber, isLoading };
};

interface WhatsAppButtonProps {
  type: 'products' | 'crafts';
  title: string;
  description: string;
}

const WhatsAppButton = ({ 
  type,
  title, 
  description 
}: WhatsAppButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localNumber, setLocalNumber] = useState('');
  const { t } = useLanguage();
  const { number, updateNumber, isLoading } = useWhatsAppNumbers(type);

  useEffect(() => {
    setLocalNumber(number);
  }, [number]);

  const handleSave = async () => {
    const success = await updateNumber(localNumber);
    if (success) {
      toast({
        title: t('common.saved') || 'Saved!',
  description: t('whatsappNumberUpdated') || 'WhatsApp number has been updated.',
      });
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    if (number) {
      window.open(`https://wa.me/${number}`, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b px-6 py-4">
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-number" className="text-sm font-medium text-gray-700">
                {t('whatsappNumber') || 'WhatsApp Number'}
              </Label>
              <div className="w-full">
                <PhoneInput
                  value={localNumber}
                  onChange={setLocalNumber}
                  placeholder={t('enterWhatsAppNumber') || 'Enter WhatsApp number'}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-sm font-medium"
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button 
                onClick={handleSave} 
                size="sm"
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('common.save') || 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  {t('currentNumber') || 'Current Number'}
                </p>
                <p className="text-lg font-mono text-gray-800 mt-1">
                  {number || t('noNumberSet') || 'No number set'}
                </p>
              </div>
              {number && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={handleClick}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.5 1.25a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7a.75.75 0 0 1 0-1.5h13.69l-3.22-3.22a.75.75 0 0 1 0-1.06z"/>
                    <path d="M11.5 7a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75z"/>
                    <path d="M11.5 13.25a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75z"/>
                    <path d="M11.5 19.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75z"/>
                  </svg>
                  {t('testWhatsApp') || 'Test WhatsApp'}
                </Button>
              )}
            </div>
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('common.edit') || 'Edit'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface WhatsAppButtonManagerProps {
  initialProductsNumber?: string;
  initialCraftsNumber?: string;
  onSaveNumbers?: (productsNumber: string, craftsNumber: string) => void;
}

const WhatsAppButtonManager = ({
  initialProductsNumber = '',
  initialCraftsNumber = '',
  onSaveNumbers,
}: WhatsAppButtonManagerProps) => {
  const { t } = useLanguage();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use the migration hook
  useSettingsMigration();
  
  // Use the custom hook for each number
  const {
    number: productsNumber,
    updateNumber: updateProductsNumber,
    isLoading: isLoadingProducts
  } = useWhatsAppNumbers('products');
  
  const {
    number: craftsNumber,
    updateNumber: updateCraftsNumber,
    isLoading: isLoadingCrafts
  } = useWhatsAppNumbers('crafts');
  
  const [isEditing, setIsEditing] = useState(false);
  const [localProductsNumber, setLocalProductsNumber] = useState(initialProductsNumber);
  const [localCraftsNumber, setLocalCraftsNumber] = useState(initialCraftsNumber);
  
  // Update local state when numbers are loaded
  useEffect(() => {
    if (productsNumber !== undefined && craftsNumber !== undefined && !isInitialized) {
      setLocalProductsNumber(productsNumber);
      setLocalCraftsNumber(craftsNumber);
      setIsInitialized(true);
    }
  }, [productsNumber, craftsNumber, isInitialized]);
  
  const handleSave = async () => {
    try {
      // Format numbers to ensure they have the correct format
      const formattedProductsNumber = localProductsNumber.startsWith('+') 
        ? localProductsNumber 
        : `+${localProductsNumber}`;
      
      const formattedCraftsNumber = localCraftsNumber.startsWith('+') 
        ? localCraftsNumber 
        : localCraftsNumber ? `+${localCraftsNumber}` : '';

      if (onSaveNumbers) {
        onSaveNumbers(formattedProductsNumber, formattedCraftsNumber);
      } else {
        // Save to Firestore
        await updateProductsNumber(formattedProductsNumber);
        await updateCraftsNumber(formattedCraftsNumber);
      }
      setIsEditing(false);
      
      toast({
        title: t('common.saved') || 'Saved!',
  description: t('whatsappNumbersUpdated') || 'WhatsApp numbers have been updated.',
      });
    } catch (error) {
      console.error('Error saving WhatsApp numbers:', error);
      toast({
        title: t('common.error') || 'Error',
  description: t('errorSavingNumber') || 'Failed to save WhatsApp numbers.',
        variant: 'destructive',
      });
    }
  };

  if (isLoadingProducts || isLoadingCrafts) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t('productsWhatsApp') || 'Products WhatsApp'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t('craftsWhatsApp') || 'Handmade Crafts WhatsApp'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderEditForm = () => (
    <div className="space-y-4">
      <div>
        <PhoneInput
          label={t('productsWhatsApp') || 'Products WhatsApp'}
          value={localProductsNumber}
          onChange={setLocalProductsNumber}
          required
        />
      </div>
      <div>
        <PhoneInput
          label={t('craftsWhatsApp') || 'Handmade Crafts WhatsApp'}
          value={localCraftsNumber}
          onChange={setLocalCraftsNumber}
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          {t('common.cancel') || 'Cancel'}
        </Button>
        <Button onClick={handleSave}>
          {t('common.save') || 'Save'}
        </Button>
      </div>
    </div>
  );

  const renderViewMode = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WhatsAppButton
        type="products"
  title={t('productsWhatsApp') || 'Products WhatsApp'}
  description={localProductsNumber || t('notSet') || 'Not set'}
      />
      <WhatsAppButton
        type="crafts"
  title={t('craftsWhatsApp') || 'Handmade Crafts WhatsApp'}
  description={localCraftsNumber || t('notSet') || 'Not set'}
      />
      <div className="col-span-full flex justify-end">
        <Button onClick={() => setIsEditing(true)}>
          {t('common.edit') || 'Edit Numbers'}
        </Button>
      </div>
    </div>
  );

  return isEditing ? renderEditForm() : renderViewMode();
};

export default WhatsAppButtonManager;
