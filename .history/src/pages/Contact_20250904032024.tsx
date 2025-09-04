import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { getContactInfo, getBusinessHours, formatBusinessHours } from "@/utils/contactUtils";
import { useWhatsAppNumbers } from "@/components/admin/WhatsAppButtonManager";
import { useContacts } from '@/hooks/useContacts';

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  whatsappNumber: string;
}

interface BusinessPeriod {
  days: {
    start: string;
    end: string;
  };
  hours: {
    open: string;
    close: string;
  };
  isClosed: boolean;
}

interface BusinessHours {
  periods: BusinessPeriod[];
}

const Contact = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    toast({
      title: t('common.success'),
      description: isRTL ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  // Load contact info and business hours from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedContactInfo = localStorage.getItem('contactInfo');
        const savedBusinessHours = localStorage.getItem('businessHours');

        if (savedContactInfo) {
          setContactInfo(JSON.parse(savedContactInfo));
        }

        if (savedBusinessHours) {
          setBusinessHours(JSON.parse(savedBusinessHours));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'contactInfo' || e.key === 'businessHours') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { contacts, loading, error } = useContacts();

  useEffect(() => {
    if (!loading && !error && contacts.length > 0) {
      const contact = contacts[0]; // Assuming the first contact is the primary one
      setContactInfo({
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        addressAr: contact.addressAr || contact.address
      });
    }
  }, [contacts, loading, error]);

  const handleWhatsAppContact = () => {
    if (!whatsappNumber) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL 
          ? 'لم يتم تعيين رقم واتساب. يرجى المحاولة لاحقاً.'
          : 'WhatsApp number is not set. Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    
    const message = isRTL 
      ? 'مرحباً، أود التواصل معكم بخصوص متجركم'
      : 'Hello, I would like to contact you about your store';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Format business hours for display
  const formatBusinessHours = () => {
    if (!businessHours?.periods?.length) {
      return isRTL ? 'غير متوفر' : 'Not available';
    }

    return businessHours.periods.map(period => {
      if (period.isClosed) {
        return isRTL 
          ? `${formatDay(period.days.start)} - ${formatDay(period.days.end)}: ${isRTL ? 'مغلق' : 'Closed'}`
          : `${formatDay(period.days.start)} - ${formatDay(period.days.end)}: Closed`;
      }
      
      return isRTL
        ? `${formatDay(period.days.start)} - ${formatDay(period.days.end)}: ${period.hours.open} - ${period.hours.close}`
        : `${formatDay(period.days.start)} - ${formatDay(period.days.end)}: ${period.hours.open} - ${period.hours.close}`;
    }).join('\n');
  };

  // Helper function to format day names
  const formatDay = (day: string) => {
    const days = {
      'Sunday': isRTL ? 'الأحد' : 'Sunday',
      'Monday': isRTL ? 'الاثنين' : 'Monday',
      'Tuesday': isRTL ? 'الثلاثاء' : 'Tuesday',
      'Wednesday': isRTL ? 'الأربعاء' : 'Wednesday',
      'Thursday': isRTL ? 'الخميس' : 'Thursday',
      'Friday': isRTL ? 'الجمعة' : 'Friday',
      'Saturday': isRTL ? 'السبت' : 'Saturday'
    };
    
    return days[day as keyof typeof days] || day;
  };

  const [contactInfo, setContactInfo] = useState({
    phone: '+962 77 123 4567',
    email: 'info@ourkitchen.com',
    address: 'Amman, Jordan',
    addressAr: 'عمان، الأردن',
  });
  
  // Get WhatsApp number for products (default)
  const { number: whatsappNumber } = useWhatsAppNumbers('products');

  const [businessHours, setBusinessHours] = useState({
    periods: [
      {
        days: { start: 'Sunday', end: 'Thursday' },
        hours: { open: '09:00', close: '18:00' },
        isClosed: false
      },
      {
        days: { start: 'Friday', end: 'Friday' },
        hours: { open: '14:00', close: '20:00' },
        isClosed: true
      },
      {
        days: { start: 'Saturday', end: 'Saturday' },
        hours: { open: '00:00', close: '00:00' },
        isClosed: true
      }
    ]
  });

  const contactInfoItems = [
    {
      icon: Phone,
      title: isRTL ? 'الهاتف' : 'Phone',
      value: contactInfo.phone,
      action: () => window.location.href = `tel:${contactInfo.phone.replace(/\D/g, '')}`
    },
    {
      icon: Mail,
      title: isRTL ? 'البريد الإلكتروني' : 'Email',
      value: contactInfo.email,
      action: () => window.location.href = `mailto:${contactInfo.email}`
    },
    {
      icon: MapPin,
      title: isRTL ? 'العنوان' : 'Address',
      value: isRTL ? contactInfo.addressAr || contactInfo.address : contactInfo.address,
      action: () => {}
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isRTL ? 'arabic-text' : ''}`}>
            {t('contact.title')}
          </h1>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isRTL ? 'arabic-text' : ''}`}>
            {isRTL 
              ? 'نحن هنا للإجابة على أسئلتك ومساعدتك. لا تترددي في التواصل معنا'
              : 'We are here to answer your questions and help you. Don\'t hesitate to contact us'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="card-shadow">
            <CardContent className="p-8">
              <h2 className={`text-2xl font-bold mb-6 ${isRTL ? 'arabic-text' : ''}`}>
                {isRTL ? 'أرسلي رسالة' : 'Send a Message'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className={`text-sm font-medium ${isRTL ? 'arabic-text' : ''}`}>
                    {t('contact.name')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`mt-1 ${isRTL ? 'text-right' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className={`text-sm font-medium ${isRTL ? 'arabic-text' : ''}`}>
                    {t('contact.email')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`mt-1 ${isRTL ? 'text-right' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className={`text-sm font-medium ${isRTL ? 'arabic-text' : ''}`}>
                    {t('contact.message')}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className={`mt-1 ${isRTL ? 'text-right' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <Button type="submit" className="w-full btn-warm">
                  <Send className="h-4 w-4 mr-2" />
                  <span className={isRTL ? 'arabic-text' : ''}>
                    {t('contact.send')}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & WhatsApp */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="card-shadow">
              <CardContent className="p-8">
                <h2 className={`text-2xl font-bold mb-6 ${isRTL ? 'arabic-text' : ''}`}>
                  {isRTL ? 'معلومات التواصل' : 'Contact Information'}
                </h2>
                
                <div className="space-y-4">
                  {contactInfoItems.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div 
                        key={index}
                        className={`flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                        onClick={info.action}
                      >
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div className={isRTL ? 'text-right' : ''}>
                          <h3 className={`font-medium ${isRTL ? 'arabic-text' : ''}`}>
                            {info.title}
                          </h3>
                          <p className="text-muted-foreground">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                  {/* WhatsApp Contact Item */}
                  <div 
                    className={`flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                    onClick={handleWhatsAppContact}
                  >
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div className={isRTL ? 'text-right' : ''}>
                      <h3 className={`font-medium ${isRTL ? 'arabic-text' : ''}`}>
                        {isRTL ? 'واتساب' : 'WhatsApp'}
                      </h3>
                      <p className="text-muted-foreground">
                        {whatsappNumber?.number || (isRTL ? 'غير متوفر حالياً' : 'Not available')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="card-shadow">
              <CardContent className="p-8">
                <h2 className={`text-2xl font-bold mb-6 ${isRTL ? 'arabic-text' : ''}`}>
                  {isRTL ? 'ساعات العمل' : 'Business Hours'}
                </h2>
                <div className="space-y-3">
                  {businessHours?.periods?.map((period, index) => {
                    const daysText = period.days.start === period.days.end 
                      ? formatDay(period.days.start)
                      : `${formatDay(period.days.start)} - ${formatDay(period.days.end)}`;
                    
                    const hoursText = period.isClosed 
                      ? isRTL ? 'مغلق' : 'Closed'
                      : `${period.hours.open} - ${period.hours.close}`;
                    
                    return (
                      <div key={index} className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`font-medium ${isRTL ? 'arabic-text' : ''}`}>
                          {daysText}
                        </span>
                        <span className="text-muted-foreground">
                          {hoursText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Contact */}
            <Card className="card-shadow bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className={`text-2xl font-bold mb-4 text-green-800 ${isRTL ? 'arabic-text' : ''}`}>
                  {t('contact.whatsapp')}
                </h2>
                <p className={`text-green-700 mb-2 ${isRTL ? 'arabic-text' : ''}`}>
                  {isRTL 
                    ? 'تواصلي معنا مباشرة عبر واتساب للحصول على رد سريع'
                    : 'Contact us directly via WhatsApp for a quick response'
                  }
                </p>
                {whatsappNumber ? (
                  <p className="text-green-800 font-mono mb-4">
                    {whatsappNumber?.number}
                  </p>
                ) : (
                  <p className="text-amber-700 text-sm mb-4">
                    {isRTL 
                      ? 'لم يتم تعيين رقم واتساب. يرجى المحاولة لاحقاً.'
                      : 'WhatsApp number is not set. Please try again later.'
                    }
                  </p>
                )}
                <Button 
                  onClick={handleWhatsAppContact}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  disabled={!whatsappNumber}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span className={isRTL ? 'arabic-text' : ''}>
                    {isRTL ? 'افتح واتساب' : 'Open WhatsApp'}
                  </span>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;