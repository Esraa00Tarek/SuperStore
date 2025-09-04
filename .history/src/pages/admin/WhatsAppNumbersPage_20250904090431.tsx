import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import WhatsAppButtonManager from '@/components/admin/WhatsAppButtonManager';
import { toast } from '@/components/ui/use-toast';

type WhatsAppNumber = {
  id: string;
  number: string;
  label: string;
  isDefault: boolean;
};

const WhatsAppNumbersPage = () => {
  const { t, isRTL } = useLanguage();
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNumber, setNewNumber] = useState('');
  const [newLabel, setNewLabel] = useState('');

  // Load numbers on component mount
  useEffect(() => {
    const loadNumbers = () => {
      try {
        const savedNumbers = localStorage.getItem('whatsappNumbers');
        if (savedNumbers) {
          setNumbers(JSON.parse(savedNumbers));
        } else {
          // Initialize with default number if none exists
          const defaultNumber = {
            id: 'default',
            number: '962771234567',
            label: 'Main',
            isDefault: true
          };
          setNumbers([defaultNumber]);
          localStorage.setItem('whatsappNumbers', JSON.stringify([defaultNumber]));
        }
      } catch (error) {
        console.error('Error loading WhatsApp numbers:', error);
        toast({
          title: 'Error',
          description: 'Failed To Load WhatsApp Numbers',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNumbers();
  }, [t]);

  const handleSaveNumbers = (productsNumber: string, craftsNumber: string) => {
    try {
      // Save to localStorage
      const numbersToSave = {
        products: productsNumber,
        crafts: craftsNumber
      };
      localStorage.setItem('whatsapp_numbers', JSON.stringify(numbersToSave));
      
      toast({
        title: t('success') || 'Success',
        description: t('whatsapp.numbersSaved') || 'WhatsApp numbers saved successfully',
      });
    } catch (error) {
      console.error('Error saving WhatsApp numbers:', error);
      toast({
        title: t('error') || 'Error',
        description: t('whatsapp.saveError') || 'Failed to save WhatsApp numbers',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>;
  }
  
  return (
    <div className="container mx-auto p-2 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>
              {isRTL ? 'إعدادات أرقام واتساب' : 'WhatsApp Numbers Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WhatsAppButtonManager 
              onSaveNumbers={handleSaveNumbers}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppNumbersPage;
