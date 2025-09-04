import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

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

  return { number, isLoading };
};
