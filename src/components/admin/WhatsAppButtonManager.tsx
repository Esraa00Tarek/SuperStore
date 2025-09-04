import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { db } from '@/firebase/config';
import { useSettingsMigration } from '@/hooks/useSettingsMigration';
import PhoneInput from '@/components/common/PhoneInput';

// دالة لتحويل النص لـ Title Case وتشيل أي نقطة
const formatText = (text: string) => {
  if (!text) return '';
  const cleaned = text.replace(/\./g, ' ');
  return cleaned.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
};

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

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setNumber(docSnap.data()[type] || '');

        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) setNumber(doc.data()[type] || '');
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading WhatsApp number:', error);
        toast({
          title: formatText(t('common.error') || 'Error'),
          description: formatText(t('errorLoadingNumber') || 'Failed to load WhatsApp number.'),
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
      const docRef = doc(db, 'whatsapp', 'numbers');
      await setDoc(docRef, { [type]: newNumber }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating WhatsApp number:', error);
      toast({
        title: formatText(t('common.error') || 'Error'),
        description: formatText(t('errorSavingNumber') || 'Failed to save WhatsApp number.'),
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

const WhatsAppButton = ({ type, title, description }: WhatsAppButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localNumber, setLocalNumber] = useState('');
  const { t } = useLanguage();
  const { number, updateNumber, isLoading } = useWhatsAppNumbers(type);

  useEffect(() => setLocalNumber(number), [number]);

  const handleSave = async () => {
    const success = await updateNumber(localNumber);
    if (success) {
      toast({
        title: formatText(t('common.saved') || 'Saved!'),
        description: formatText(t('whatsappNumberUpdated') || 'WhatsApp number has been updated.'),
      });
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    if (number) window.open(`https://wa.me/${number}`, '_blank');
  };

  return (
    <Card className="w-full md:max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b px-4 py-3 md:px-6 md:py-4">
        <CardTitle className="text-md md:text-lg font-semibold text-gray-800">{formatText(title)}</CardTitle>
        <p className="text-xs md:text-sm text-gray-500 mt-1">{formatText(description || t('notSet') || 'Not set')}</p>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-number" className="text-sm font-medium text-gray-700">
                {formatText(t('whatsappNumber') || 'WhatsApp Number')}
              </Label>
              <PhoneInput
                value={localNumber}
                onChange={setLocalNumber}
                placeholder={formatText(t('enterWhatsAppNumber') || 'Enter WhatsApp number')}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                {formatText(t('common.cancel') || 'Cancel')}
              </Button>
              <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                {formatText(t('common.save') || 'Save Changes')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-500">{formatText(t('currentNumber') || 'Current Number')}</p>
                <p className="text-sm md:text-lg font-mono text-gray-800 mt-1">{number || formatText(t('noNumberSet') || 'No number set')}</p>
              </div>
              {number && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 mt-2 sm:mt-0"
                  onClick={handleClick}
                >
                  {formatText(t('testWhatsApp') || 'Test WhatsApp')}
                </Button>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-blue-600 hover:bg-blue-50">
                {formatText(t('common.edit') || 'Edit')}
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

  useSettingsMigration();

  const {
    number: productsNumber,
    updateNumber: updateProductsNumber,
    isLoading: isLoadingProducts,
  } = useWhatsAppNumbers('products');

  const {
    number: craftsNumber,
    updateNumber: updateCraftsNumber,
    isLoading: isLoadingCrafts,
  } = useWhatsAppNumbers('crafts');

  const [isEditing, setIsEditing] = useState(false);
  const [localProductsNumber, setLocalProductsNumber] = useState(initialProductsNumber);
  const [localCraftsNumber, setLocalCraftsNumber] = useState(initialCraftsNumber);

  useEffect(() => {
    if (!isInitialized && productsNumber !== undefined && craftsNumber !== undefined) {
      setLocalProductsNumber(productsNumber);
      setLocalCraftsNumber(craftsNumber);
      setIsInitialized(true);
    }
  }, [productsNumber, craftsNumber, isInitialized]);

  const handleSave = async () => {
    try {
      const formattedProductsNumber = localProductsNumber.startsWith('+') ? localProductsNumber : `+${localProductsNumber}`;
      const formattedCraftsNumber = localCraftsNumber.startsWith('+') ? localCraftsNumber : localCraftsNumber ? `+${localCraftsNumber}` : '';

      if (onSaveNumbers) {
        onSaveNumbers(formattedProductsNumber, formattedCraftsNumber);
      } else {
        await updateProductsNumber(formattedProductsNumber);
        await updateCraftsNumber(formattedCraftsNumber);
      }
      setIsEditing(false);
      toast({
        title: formatText(t('common.saved') || 'Saved!'),
        description: formatText(t('whatsappNumbersUpdated') || 'WhatsApp numbers have been updated.'),
      });
    } catch (error) {
      console.error('Error saving WhatsApp numbers:', error);
      toast({
        title: formatText(t('common.error') || 'Error'),
        description: formatText(t('errorSavingNumber') || 'Failed to save WhatsApp numbers.'),
        variant: 'destructive',
      });
    }
  };

  if (isLoadingProducts || isLoadingCrafts) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-4 animate-pulse h-28"></Card>
        <Card className="mb-4 animate-pulse h-28"></Card>
      </div>
    );
  }

  return isEditing ? (
    <div className="space-y-4 md:space-y-6">
      <PhoneInput
        label={formatText(t('productsWhatsApp') || 'Products WhatsApp')}
        value={localProductsNumber}
        onChange={setLocalProductsNumber}
        required
      />
      <PhoneInput
        label={formatText(t('craftsWhatsApp') || 'Handmade Crafts WhatsApp')}
        value={localCraftsNumber}
        onChange={setLocalCraftsNumber}
      />
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          {formatText(t('common.cancel') || 'Cancel')}
        </Button>
        <Button onClick={handleSave}>{formatText(t('common.save') || 'Save')}</Button>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WhatsAppButton
        type="products"
        title={formatText(t('productsWhatsApp') || 'Products WhatsApp')}
        description={formatText(localProductsNumber || t('notSet') || 'Not set')}
      />
      <WhatsAppButton
        type="crafts"
        title={formatText(t('craftsWhatsApp') || 'Handmade Crafts WhatsApp')}
        description={formatText(localCraftsNumber || t('notSet') || 'Not set')}
      />
      <div className="col-span-full flex justify-end">
        <Button onClick={() => setIsEditing(true)}>
          {formatText(t('common.edit') || 'Edit Numbers')}
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppButtonManager;
