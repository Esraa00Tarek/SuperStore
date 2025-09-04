import { db } from '@/firebase/config';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Collection and document IDs
const COLLECTIONS = {
  WHATSAPP: 'whatsapp',
  CONTACT_INFO: 'contactInfo',
  BUSINESS_HOURS: 'businessHours',
  SETTINGS: 'settings'
} as const;

const DOC_IDS = {
  NUMBERS: 'numbers',
  CONTACT: 'contact',
  HOURS: 'hours'
} as const;

// Types
type WhatsAppNumbers = {
  products: string;
  crafts: string;
};

type ContactInfo = {
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  whatsappNumber: string;
};

type BusinessPeriod = {
  days: {
    start: string;
    end: string;
  };
  hours: {
    open: string;
    close: string;
  };
  isClosed: boolean;
};

type BusinessHours = {
  periods: BusinessPeriod[];
};

// WhatsApp Numbers
const getWhatsAppNumbers = async (): Promise<WhatsAppNumbers | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.WHATSAPP, DOC_IDS.NUMBERS);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        products: data.products || '',
        crafts: data.crafts || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting WhatsApp numbers:', error);
    return null;
  }
};

export const updateWhatsAppNumber = async (type: 'products' | 'crafts', number: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.WHATSAPP, DOC_IDS.NUMBERS);
    await setDoc(docRef, { [type]: number }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating WhatsApp number:', error);
    return false;
  }
};

export const subscribeToWhatsAppNumbers = (callback: (data: WhatsAppNumbers | null) => void) => {
  const docRef = doc(db, COLLECTIONS.WHATSAPP, DOC_IDS.NUMBERS);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        products: data.products || '',
        crafts: data.crafts || ''
      });
    } else {
      // Return empty WhatsApp numbers if no data exists
      callback({
        products: '',
        crafts: ''
      });
    }
  });
};

// Contact Info
export const getContactInfo = async (): Promise<ContactInfo> => {
  try {
    const docRef = doc(db, COLLECTIONS.CONTACT_INFO, DOC_IDS.CONTACT);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        addressAr: data.addressAr || '',
        whatsappNumber: data.whatsappNumber || ''
      };
    } else {
      // Return empty contact info if no data exists
      return {
        phone: '',
        email: '',
        address: '',
        addressAr: '',
        whatsappNumber: ''
      };
    }
  } catch (error) {
    console.error('Error getting contact info:', error);
    return null;
  }
};

export const updateContactInfo = async (data: Partial<ContactInfo>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.CONTACT_INFO, DOC_IDS.CONTACT);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating contact info:', error);
    return false;
  }
};

export const subscribeToContactInfo = (callback: (data: ContactInfo) => void) => {
  const docRef = doc(db, COLLECTIONS.CONTACT_INFO, DOC_IDS.CONTACT);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        addressAr: data.addressAr || '',
        whatsappNumber: data.whatsappNumber || ''
      });
    } else {
      // Return empty contact info if no data exists
      callback({
        phone: '',
        email: '',
        address: '',
        addressAr: '',
        whatsappNumber: ''
      });
    }
  });
};

// Business Hours
export const getBusinessHours = async (): Promise<BusinessHours | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.BUSINESS_HOURS, DOC_IDS.HOURS);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as BusinessHours;
    } else {
      // Return default business hours if no data exists
      return {
        periods: [
          {
            days: { start: 'Sunday', end: 'Thursday' },
            hours: { open: '09:00', close: '18:00' },
            isClosed: false
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error getting business hours:', error);
    return null;
  }
};

export const updateBusinessHours = async (data: BusinessHours): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.BUSINESS_HOURS, DOC_IDS.HOURS);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating business hours:', error);
    return false;
  }
};

export const subscribeToBusinessHours = (callback: (data: BusinessHours | null) => void) => {
  const docRef = doc(db, COLLECTIONS.BUSINESS_HOURS, DOC_IDS.HOURS);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as BusinessHours);
    } else {
      // Return default business hours if no data exists
      callback({
        periods: [
          {
            days: { start: 'Sunday', end: 'Thursday' },
            hours: { open: '09:00', close: '18:00' },
            isClosed: false
          }
        ]
      });
    }
  });
};

// Export types
export type { WhatsAppNumbers, ContactInfo, BusinessPeriod, BusinessHours };

interface SettingsService {
  // WhatsApp
  getWhatsAppNumbers(): Promise<WhatsAppNumbers | null>;
  updateWhatsAppNumber(type: 'products' | 'crafts', number: string): Promise<boolean>;
  subscribeToWhatsAppNumbers(callback: (data: WhatsAppNumbers | null) => void): () => void;
  
  // Contact Info
  getContactInfo(): Promise<ContactInfo | null>;
  updateContactInfo(data: Partial<ContactInfo>): Promise<boolean>;
  subscribeToContactInfo(callback: (data: ContactInfo) => void): () => void;
  
  // Business Hours
  getBusinessHours(): Promise<BusinessHours | null>;
  updateBusinessHours(data: BusinessHours): Promise<boolean>;
  subscribeToBusinessHours(callback: (data: BusinessHours) => void): () => void;
  
  // Default values for types
  defaults: {
    WhatsAppNumbers: WhatsAppNumbers;
    ContactInfo: ContactInfo;
    BusinessHours: BusinessHours;
    BusinessPeriod: BusinessPeriod;
  };
}

// Default values
const defaultWhatsAppNumbers: WhatsAppNumbers = {
  products: '',
  crafts: ''
};

const defaultContactInfo: ContactInfo = {
  phone: '',
  email: '',
  address: '',
  addressAr: '',
  whatsappNumber: ''
};

const defaultBusinessHours: BusinessHours = {
  periods: []
};

export const settingsService: SettingsService = {
  // WhatsApp
  getWhatsAppNumbers,
  updateWhatsAppNumber,
  subscribeToWhatsAppNumbers,
  
  // Contact Info
  getContactInfo,
  updateContactInfo,
  subscribeToContactInfo,
  
  // Business Hours
  getBusinessHours,
  updateBusinessHours,
  subscribeToBusinessHours,
  
  // Default values
  defaults: {
    WhatsAppNumbers: defaultWhatsAppNumbers,
    ContactInfo: defaultContactInfo,
    BusinessHours: defaultBusinessHours,
    BusinessPeriod: {
      days: { start: '', end: '' },
      hours: { open: '', close: '' },
      isClosed: false
    },
  },
};
