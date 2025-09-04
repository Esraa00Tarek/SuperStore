import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PhoneInput from '@/components/common/PhoneInput';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, Clock, Plus, Trash2, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { settingsService } from '@/services/settingsService';
import { useSettingsMigration } from '@/hooks/useSettingsMigration';

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

export const ContactManager = () => {
  const { t, isRTL } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '',
    email: '',
    address: '',
    addressAr: '',
    whatsappNumber: ''
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours | null>({
    periods: [
      {
        days: { start: 'Sunday', end: 'Thursday' },
        hours: { open: '09:00', close: '18:00' },
        isClosed: false
      }
    ]
  });
  
  // Use the migration hook
  useSettingsMigration();
  
  // Load data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load contact info
        const contactData = await settingsService.getContactInfo();
        if (contactData) {
          setContactInfo(prev => ({
            ...prev,
            ...contactData
          }));
        }
        
        // Load business hours
        const hoursData = await settingsService.getBusinessHours();
        if (hoursData) {
          setBusinessHours(hoursData);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: t('common.error') || 'Error',
          description: t('errorLoadingData') || 'Failed to load data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [t]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribeContact = settingsService.subscribeToContactInfo((data: ContactInfo) => {
      setContactInfo(prev => ({
        ...prev,
        ...data
      }));
    });
    
    const unsubscribeHours = settingsService.subscribeToBusinessHours((data: BusinessHours) => {
      setBusinessHours(data);
    });
    
    return () => {
      if (unsubscribeContact) unsubscribeContact();
      if (unsubscribeHours) unsubscribeHours();
    };
  }, []);

  const daysOfWeek = [
    { value: 'Monday', label: { en: 'Monday', ar: 'الاثنين' } },
    { value: 'Tuesday', label: { en: 'Tuesday', ar: 'الثلاثاء' } },
    { value: 'Wednesday', label: { en: 'Wednesday', ar: 'الأربعاء' } },
    { value: 'Thursday', label: { en: 'Thursday', ar: 'الخميس' } },
    { value: 'Friday', label: { en: 'Friday', ar: 'الجمعة' } },
    { value: 'Saturday', label: { en: 'Saturday', ar: 'السبت' } },
    { value: 'Sunday', label: { en: 'Sunday', ar: 'الأحد' } },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (name: string, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPeriod = () => {
    setBusinessHours(prev => ({
      periods: [
        ...(prev?.periods || []),
        {
          days: { start: 'Monday', end: 'Friday' },
          hours: { open: '09:00', close: '18:00' },
          isClosed: false
        }
      ]
    }));
  };

  const removePeriod = (index: number) => {
    setBusinessHours(prev => ({
      periods: (prev?.periods || []).filter((_, i) => i !== index)
    }));
  };

  const handlePeriodChange = (index: number, field: string, value: any, subField?: string) => {
    setBusinessHours(prev => {
      const currentPeriods = prev?.periods || [];
      const updatedPeriods = [...currentPeriods];
      
      if (field === 'isClosed') {
        updatedPeriods[index] = {
          ...updatedPeriods[index],
          isClosed: value as boolean,
          ...(value === true ? { hours: { open: '', close: '' } } : {})
        };
      } else if (subField) {
        updatedPeriods[index] = {
          ...updatedPeriods[index],
          [field]: {
            ...(updatedPeriods[index] as any)[field],
            [subField]: value
          }
        };
      } else {
        updatedPeriods[index] = {
          ...updatedPeriods[index],
          [field]: value
        };
      }
      
      return { periods: updatedPeriods };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Save contact info
      await settingsService.updateContactInfo(contactInfo);
      
      // Save business hours if they exist
      if (businessHours) {
        await settingsService.updateBusinessHours(businessHours);
      }
      
      toast({
        title: t('common.saved') || 'Saved!',
  description: t('contactInfoUpdated') || 'Contact information has been updated.',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: t('common.error') || 'Error',
  description: t('errorSavingData') || 'Failed to save data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (businessHours === null) {
    return <div className="w-full max-w-4xl mx-auto space-y-6 p-4">Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
              {isRTL ? 'إدارة معلومات التواصل' : 'Contact Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={handleInputChange}
                    className={isRTL ? 'text-right pl-10' : 'pl-10'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'العنوان (الإنجليزية)' : 'Address (English)'}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    value={contactInfo.address}
                    onChange={handleInputChange}
                    className={isRTL ? 'text-right pl-10' : 'pl-10'}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressAr" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'العنوان (العربية)' : 'Address (Arabic)'}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="addressAr"
                    name="addressAr"
                    value={contactInfo.addressAr}
                    onChange={handleInputChange}
                    className={isRTL ? 'text-right pl-10' : 'pl-10'}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={isRTL ? 'text-right block' : ''}>
                  {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                </Label>
                <PhoneInput
                  value={contactInfo.phone}
                  onChange={(value) => handlePhoneChange('phone', value)}
                  placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">
                  {isRTL ? 'رقم الواتساب' : 'WhatsApp Number'}
                </Label>
                <PhoneInput
                  value={contactInfo.whatsappNumber || ''}
                  onChange={(value) => handlePhoneChange('whatsappNumber', value)}
                  placeholder={isRTL ? 'أدخل رقم الواتساب' : 'Enter WhatsApp number'}
                  className="w-full"
                />
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {isRTL ? 'ساعات العمل' : 'Business Hours'}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPeriod}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? 'إضافة فترة' : 'Add Period'}
                </Button>
              </div>

              {businessHours?.periods?.map((period, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Days Selection */}
                    <div className="space-y-2">
                      <Label>{isRTL ? 'الأيام' : 'Days'}</Label>
                      <div className="flex items-center gap-2">
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={period.days.start}
                          onChange={(e) => handlePeriodChange(index, 'days', { ...period.days, start: e.target.value })}
                        >
                          {daysOfWeek.map((day) => (
                            <option key={`start-${day.value}`} value={day.value}>
                              {isRTL ? day.label.ar : day.label.en}
                            </option>
                          ))}
                        </select>
                        <span>{isRTL ? 'إلى' : 'to'}</span>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={period.days.end}
                          onChange={(e) => handlePeriodChange(index, 'days', { ...period.days, end: e.target.value })}
                        >
                          {daysOfWeek.map((day) => (
                            <option key={`end-${day.value}`} value={day.value}>
                              {isRTL ? day.label.ar : day.label.en}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Hours Selection */}
                    <div className="space-y-2">
                      <Label>{isRTL ? 'الساعات' : 'Hours'}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={period.hours.open}
                          onChange={(e) => handlePeriodChange(index, 'hours', { ...period.hours, open: e.target.value })}
                          className="w-full"
                          disabled={period.isClosed}
                          placeholder={isRTL ? 'فتح' : 'Open'}
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          value={period.hours.close}
                          onChange={(e) => handlePeriodChange(index, 'hours', { ...period.hours, close: e.target.value })}
                          className="w-full"
                          disabled={period.isClosed}
                          placeholder={isRTL ? 'إغلاق' : 'Close'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`closed-${index}`}
                        checked={period.isClosed}
                        onChange={(e) => handlePeriodChange(index, 'isClosed', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`closed-${index}`} className="text-sm">
                        {isRTL ? 'مغلق' : 'Closed'}
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePeriod(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {isRTL ? 'حذف' : 'Remove'}
                    </Button>
                  </div>

                  {index < businessHours.periods.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ContactManager;
