import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-white/90"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </Button>
  );
};