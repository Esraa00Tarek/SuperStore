import ContactManager from '../../components/admin/ContactManager';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactManagerPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full sm:container sm:mx-auto sm:py-6">
      <ContactManager />
    </div>
  );
};

export default ContactManagerPage;
