// Utility functions for managing contact information and business hours

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

// Default contact information
const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: '+962 77 123 4567',
  email: 'info@superstore.com',
  address: 'Amman, Jordan',
  addressAr: 'عمان، الأردن',
  whatsappNumber: '962771234567'
};

// Default business hours
const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  periods: [
    {
      days: { start: 'Sunday', end: 'Thursday' },
      hours: { open: '09:00', close: '18:00' },
      isClosed: false
    },
    {
      days: { start: 'Friday', end: 'Friday' },
      hours: { open: '14:00', close: '20:00' },
      isClosed: false
    }
  ]
};

// Get contact info from localStorage or return defaults
export const getContactInfo = (): ContactInfo => {
  try {
    const saved = localStorage.getItem('contactInfo');
    return saved ? JSON.parse(saved) : { ...DEFAULT_CONTACT_INFO };
  } catch (error) {
    console.error('Error loading contact info:', error);
    return { ...DEFAULT_CONTACT_INFO };
  }
};

// Get business hours from localStorage or return defaults
export const getBusinessHours = (): BusinessHours => {
  try {
    const saved = localStorage.getItem('businessHours');
    return saved ? JSON.parse(saved) : { ...DEFAULT_BUSINESS_HOURS };
  } catch (error) {
    console.error('Error loading business hours:', error);
    return { ...DEFAULT_BUSINESS_HOURS };
  }
};

// Save contact info to localStorage
export const saveContactInfo = (info: ContactInfo): void => {
  try {
    localStorage.setItem('contactInfo', JSON.stringify(info));
  } catch (error) {
    console.error('Error saving contact info:', error);
  }
};

// Save business hours to localStorage
export const saveBusinessHours = (hours: BusinessHours): void => {
  try {
    localStorage.setItem('businessHours', JSON.stringify(hours));
  } catch (error) {
    console.error('Error saving business hours:', error);
  }
};

// Format business hours for display
export const formatBusinessHours = (businessHours: BusinessHours, isRTL: boolean = false): string => {
  if (!businessHours?.periods?.length) {
    return isRTL ? 'غير متوفر' : 'Not available';
  }

  return businessHours.periods.map(period => {
    if (period.isClosed) {
      return isRTL 
        ? `${getDayName(period.days.start, isRTL)} - ${getDayName(period.days.end, isRTL)}: ${isRTL ? 'مغلق' : 'Closed'}`
        : `${getDayName(period.days.start, isRTL)} - ${getDayName(period.days.end, isRTL)}: Closed`;
    }
    
    return isRTL
      ? `${getDayName(period.days.start, isRTL)} - ${getDayName(period.days.end, isRTL)}: ${period.hours.open} - ${period.hours.close}`
      : `${getDayName(period.days.start, isRTL)} - ${getDayName(period.days.end, isRTL)}: ${period.hours.open} - ${period.hours.close}`;
  }).join('\n');
};

// Helper function to get day name in English or Arabic
const getDayName = (day: string, isRTL: boolean): string => {
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

export type { ContactInfo, BusinessPeriod, BusinessHours };
