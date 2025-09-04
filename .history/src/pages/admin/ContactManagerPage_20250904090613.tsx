import ContactManager from '../../components/admin/ContactManager';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactManagerPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6">
      <ContactManager />
    </div>
  );
};

export default ContactManagerPage;
