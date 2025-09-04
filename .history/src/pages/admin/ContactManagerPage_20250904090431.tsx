import ContactManager from '../../components/admin/ContactManager';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactManagerPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-6 px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
        <ContactManager />
      </div>
    </div>
  );
};

export default ContactManagerPage;
