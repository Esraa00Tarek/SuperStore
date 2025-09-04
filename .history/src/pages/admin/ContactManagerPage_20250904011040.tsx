import ContactManager from '../../components/admin/ContactManager';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactManagerPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('contact.manage') || 'Manage Contact Information'}
      </h1>
      <ContactManager />
    </div>
  );
};

export default ContactManagerPage;
