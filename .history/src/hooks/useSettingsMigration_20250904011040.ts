import { useEffect, useState } from 'react';
import { settingsService } from '@/services/settingsService';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSettingsMigration = () => {
  const { t } = useLanguage();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<{
    whatsapp: boolean;
    contact: boolean;
    businessHours: boolean;
  }>({
    whatsapp: false,
    contact: false,
    businessHours: false,
  });

  // Check if we need to migrate data from localStorage to Firestore
  const checkAndMigrate = async () => {
    try {
      setIsMigrating(true);
      
      // Check WhatsApp numbers
      const whatsappNumbers = localStorage.getItem('whatsapp_numbers');
      if (whatsappNumbers) {
        const numbers = JSON.parse(whatsappNumbers);
        await settingsService.updateWhatsAppNumber('products', numbers.products || '');
        await settingsService.updateWhatsAppNumber('crafts', numbers.crafts || '');
        setMigrationStatus(prev => ({ ...prev, whatsapp: true }));
      }

      // Check contact info
      const contactInfo = localStorage.getItem('contactInfo');
      if (contactInfo) {
        const contact = JSON.parse(contactInfo);
        await settingsService.updateContactInfo(contact);
        setMigrationStatus(prev => ({ ...prev, contact: true }));
      }

      // Check business hours
      const businessHours = localStorage.getItem('businessHours');
      if (businessHours) {
        const hours = JSON.parse(businessHours);
        await settingsService.updateBusinessHours(hours);
        setMigrationStatus(prev => ({ ...prev, businessHours: true }));
      }

      // Clear localStorage after successful migration
      if (whatsappNumbers || contactInfo || businessHours) {
        localStorage.removeItem('whatsapp_numbers');
        localStorage.removeItem('contactInfo');
        localStorage.removeItem('businessHours');
        
        toast({
          title: t('settings.migration.success') || 'Data Migrated Successfully!',
          description: t('settings.migration.complete') || 'Your Settings Have Been Migrated To The Cloud.',
        });
      }
    } catch (error) {
      console.error('Migration Error:', error);
      toast({
        title: t('common.error') || 'Error',
        description: t('settings.migration.error') || 'Failed To Migrate Settings.',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // Run migration check on mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      checkAndMigrate();
    }
  }, [checkAndMigrate]);

  return { isMigrating, migrationStatus };
};
