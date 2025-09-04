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
        description: t('contactInfoUpdated') || 'Contact Information Has Been Updated.',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: t('common.error') || 'Error',
        description: t('errorSavingData') || 'Failed To Save Data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (businessHours === null) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
        <div className="animate-pulse text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-0 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Card className="shadow-none sm:shadow-lg rounded-none sm:rounded-lg">
          <CardHeader className="pb-3 sm:pb-6 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className={`text-xl sm:text-2xl font-bold ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'إدارة معلومات التواصل' : 'Contact Information Management'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Contact Information Section */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className={`text-lg sm:text-xl font-semibold border-b pb-1.5 sm:pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={handleInputChange}
                      className={`h-11 ${isRTL ? 'text-right pr-10 pl-3' : 'pl-10 pr-3'} text-sm`}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      placeholder={isRTL ? 'example@domain.com' : 'example@domain.com'}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  </Label>
                  <PhoneInput
                    value={contactInfo.phone}
                    onChange={(value) => handlePhoneChange('phone', value)}
                    placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                    className="w-full h-11"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber" className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'رقم الواتساب' : 'WhatsApp Number'}
                  </Label>
                  <PhoneInput
                    value={contactInfo.whatsappNumber || ''}
                    onChange={(value) => handlePhoneChange('whatsappNumber', value)}
                    placeholder={isRTL ? 'أدخل رقم الواتساب' : 'Enter WhatsApp number'}
                    className="w-full h-11"
                  />
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'العنوان (الإنجليزية)' : 'Address (English)'}
                  </Label>
                  <div className="relative">
                    <MapPin className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="address"
                      name="address"
                      value={contactInfo.address}
                      onChange={handleInputChange}
                      className={`min-h-[44px] ${isRTL ? 'text-right pr-10 pl-3' : 'pl-10 pr-3'} text-sm`}
                      dir="ltr"
                      placeholder={isRTL ? 'أدخل العنوان بالإنجليزية' : 'Enter address in English'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressAr" className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                    {isRTL ? 'العنوان (العربية)' : 'Address (Arabic)'}
                  </Label>
                  <div className="relative">
                    <MapPin className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      id="addressAr"
                      name="addressAr"
                      value={contactInfo.addressAr}
                      onChange={handleInputChange}
                      className={`min-h-[44px] ${isRTL ? 'text-right pr-10 pl-3' : 'pl-10 pr-3'} text-sm`}
                      dir="rtl"
                      placeholder={isRTL ? 'أدخل العنوان بالعربية' : 'Enter address in Arabic'}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Business Hours Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <h3 className={`text-lg sm:text-xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Clock className={`inline h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'ساعات العمل' : 'Business Hours'}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPeriod}
                  className={`w-full sm:w-auto h-10 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'إضافة فترة عمل' : 'Add Work Period'}
                </Button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {businessHours?.periods?.map((period, index) => (
                  <div key={index} className="border rounded-xl p-4 sm:p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Period Header */}
                      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                        <h4 className={`font-medium text-base ${isRTL ? 'text-right' : 'text-left'}`}>
                          {isRTL ? `فترة العمل ${index + 1}` : `Work Period ${index + 1}`}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePeriod(index)}
                          className={`text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {isRTL ? 'حذف الفترة' : 'Remove Period'}
                        </Button>
                      </div>

                      {/* Days and Hours Grid */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Days Selection */}
                        <div className="space-y-3">
                          <Label className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                            {isRTL ? 'أيام العمل' : 'Working Days'}
                          </Label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <select
                              className={`flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isRTL ? 'text-right' : 'text-left'}`}
                              value={period.days.start}
                              onChange={(e) => handlePeriodChange(index, 'days', { ...period.days, start: e.target.value })}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            >
                              {daysOfWeek.map((day) => (
                                <option key={`start-${day.value}`} value={day.value}>
                                  {isRTL ? day.label.ar : day.label.en}
                                </option>
                              ))}
                            </select>
                            <span className={`text-sm font-medium text-center sm:px-2 ${isRTL ? 'order-first sm:order-none' : ''}`}>
                              {isRTL ? 'إلى' : 'to'}
                            </span>
                            <select
                              className={`flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isRTL ? 'text-right' : 'text-left'}`}
                              value={period.days.end}
                              onChange={(e) => handlePeriodChange(index, 'days', { ...period.days, end: e.target.value })}
                              dir={isRTL ? 'rtl' : 'ltr'}
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
                        <div className="space-y-3">
                          <Label className={`text-sm font-medium ${isRTL ? 'text-right block' : ''}`}>
                            {isRTL ? 'ساعات العمل' : 'Working Hours'}
                          </Label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Input
                              type="time"
                              value={period.hours.open}
                              onChange={(e) => handlePeriodChange(index, 'hours', { ...period.hours, open: e.target.value })}
                              className="w-full h-11 text-sm"
                              disabled={period.isClosed}
                              placeholder={isRTL ? 'وقت الفتح' : 'Opening time'}
                            />
                            <span className={`text-sm font-medium text-center sm:px-2 ${isRTL ? 'order-first sm:order-none' : ''}`}>
                              —
                            </span>
                            <Input
                              type="time"
                              value={period.hours.close}
                              onChange={(e) => handlePeriodChange(index, 'hours', { ...period.hours, close: e.target.value })}
                              className="w-full h-11 text-sm"
                              disabled={period.isClosed}
                              placeholder={isRTL ? 'وقت الإغلاق' : 'Closing time'}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Closed Checkbox */}
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <input
                          type="checkbox"
                          id={`closed-${index}`}
                          checked={period.isClosed}
                          onChange={(e) => handlePeriodChange(index, 'isClosed', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2"
                        />
                        <Label htmlFor={`closed-${index}`} className="text-sm font-medium cursor-pointer">
                          {isRTL ? 'مغلق في هذه الفترة' : 'Closed during this period'}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} pt-4 sm:pt-6 border-t`}>
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className={`w-full sm:w-auto min-w-[140px] sm:min-w-[160px] h-10 sm:h-12 text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {isLoading ? (
                  <div className={`animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                ) : (
                  <Save className={`h-3 w-3 sm:h-4 sm:w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {isRTL ? 'حفظ جميع التغييرات' : 'Save All Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ContactManager;