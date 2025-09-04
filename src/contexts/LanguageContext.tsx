import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.crafts': 'الأعمال اليدوية',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.admin': 'لوحة التحكم',
    'nav.logout': 'تسجيل خروج',
    'nav.profile': 'الملف الشخصي',
    
    // Homepage
    'hero.title': 'مرحباً بكم في مطبخنا',
    'hero.subtitle': 'منصة مجتمعية تمكن النساء من بيع الطعام المنزلي والحلويات والمنتجات اليدوية',
    'hero.cta': 'استكشف المنتجات',
    
    // Categories
    'categories.title': 'فئات المنتجات',
    'categories.meals': 'الوجبات المطبوخة',
    'categories.pastries': 'المعجنات',
    'categories.sweets': 'الحلويات',
    'categories.handmade': 'المنتجات اليدوية',
    
    // Mission
    'mission.title': 'مهمتنا',
    'mission.text': 'نحن نؤمن بقوة المرأة في المجتمع ونسعى لتمكينها اقتصادياً من خلال دعم مشاريعها المنزلية الصغيرة وتسويق منتجاتها عالية الجودة.',
    
    // Products
    'product.order': 'اطلب عبر واتساب',
    'product.price': 'السعر',
    
    // About
    'about.title': 'قصتنا',
    'about.story': 'بدأت فكرة مطبخنا من إيماننا العميق بقدرة المرأة على الإبداع والإنتاج. نحن منصة تهدف إلى ربط النساء المبدعات في المطبخ والأعمال اليدوية بالمجتمع المحلي.',
    'about.mission.title': 'مهمتنا',
    'about.mission.text': 'تمكين النساء اقتصادياً من خلال دعم مشاريعهن المنزلية وتوفير منصة آمنة لعرض وبيع منتجاتهن عالية الجودة.',
    
    // Contact
    'contact.title': 'تواصل معنا',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    
    // Admin
    'admin.dashboard': 'لوحة التحكم',
    'admin.products': 'المنتجات',
    'admin.contactInfo': 'معلومات التواصل',
    'admin.profile': 'الملف الشخصي',
    'admin.addProduct': 'إضافة منتج',
    'admin.editProduct': 'تعديل المنتج',
    'admin.productName': 'اسم المنتج',
    'admin.description': 'الوصف',
    'admin.price': 'السعر',
    'admin.category': 'الفئة',
    'admin.imageUrl': 'رابط الصورة',
    'admin.save': 'حفظ',
    'admin.cancel': 'إلغاء',
    'admin.delete': 'حذف',
    'admin.edit': 'تعديل',
    'admin.productList': 'قائمة المنتجات',
    'admin.noProducts': 'لا توجد منتجات مضافة',
    'admin.contactInfoTitle': 'معلومات التواصل',
    'admin.whatsappNumber': 'رقم واتساب الطلبات',
    'admin.phoneNumber': 'رقم الهاتف',
    'admin.email': 'البريد الإلكتروني',
    'admin.saveChanges': 'حفظ التغييرات',
    'admin.profileInfo': 'معلومات الحساب',
    'admin.username': 'اسم المستخدم',
    'admin.password': 'كلمة المرور',
    'admin.currentPassword': 'كلمة المرور الحالية',
    'admin.newPassword': 'كلمة المرور الجديدة',
    'admin.confirmPassword': 'تأكيد كلمة المرور',
    'admin.updateProfile': 'تحديث الملف الشخصي',
    'admin.login': 'تسجيل الدخول',
    'admin.loginTitle': 'تسجيل الدخول إلى لوحة التحكم',
    'admin.loginButton': 'تسجيل الدخول',
    'admin.credentials': 'بيانات الدخول الافتراضية:',
    'admin.usernamePlaceholder': 'أدخل اسم المستخدم',
    'admin.passwordPlaceholder': 'أدخل كلمة المرور',
    'admin.language': 'اللغة',
    'admin.arabic': 'العربية',
    'admin.english': 'الإنجليزية',
    'admin.actions': 'الإجراءات',
    'admin.selectCategory': 'اختر الفئة',
    'admin.food': 'طعام',
    'admin.sweets': 'حلويات',
    'admin.crafts': 'حرف يدوية',
    'admin.areYouSure': 'هل أنت متأكد؟',
    'admin.deleteConfirm': 'هل أنت متأكد من حذف هذا المنتج؟',
    'admin.changesSaved': 'تم حفظ التغييرات بنجاح',
    'admin.profileUpdated': 'تم تحديث الملف الشخصي بنجاح',
    'admin.invalidCredentials': 'اسم المستخدم أو كلمة المرور غير صحيحة',
    'admin.passwordsDontMatch': 'كلمتا المرور غير متطابقتين',
    'admin.invalidCurrentPassword': 'كلمة المرور الحالية غير صحيحة',
    'admin.requiredField': 'هذا الحقل مطلوب',
    'admin.invalidEmail': 'البريد الإلكتروني غير صالح',
    'admin.invalidPhone': 'رقم الهاتف غير صالح',
    'admin.invalidUrl': 'رابط الصورة غير صالح',
    'admin.invalidPrice': 'السعر يجب أن يكون رقماً أكبر من الصفر',
    'admin.welcome': 'مرحباً',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال',
    'contact.whatsapp': 'تواصل عبر واتساب',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.crafts': 'Handmade Crafts',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    
    // Homepage
    'hero.title': 'Welcome to Our Kitchen',
    'hero.subtitle': 'A community platform empowering women to sell homemade food, desserts, and handmade products',
    'hero.cta': 'Explore Products',
    
    // Categories
    'categories.title': 'Product Categories',
    'categories.meals': 'Cooked Meals',
    'categories.pastries': 'Pastries',
    'categories.sweets': 'Sweets',
    'categories.handmade': 'Handmade Crafts',
    
    // Mission
    'mission.title': 'Our Mission',
    'mission.text': 'We believe in the power of women in society and seek to economically empower them by supporting their small home-based projects and marketing their high-quality products.',
    
    // Products
    'product.order': 'Order via WhatsApp',
    'product.price': 'Price',
    
    // About
    'about.title': 'Our Story',
    'about.story': 'Our kitchen idea started from our deep belief in women\'s ability to create and produce. We are a platform that aims to connect creative women in the kitchen and handicrafts with the local community.',
    'about.mission.title': 'Our Mission',
    'about.mission.text': 'Economically empowering women by supporting their home-based projects and providing a safe platform to display and sell their high-quality products.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.whatsapp': 'Contact via WhatsApp',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.contactInfo': 'Contact Information',
    'admin.profile': 'Profile',
    'admin.addProduct': 'Add Product',
    'admin.editProduct': 'Edit Product',
    'admin.productName': 'Product Name',
    'admin.description': 'Description',
    'admin.price': 'Price',
    'admin.category': 'Category',
    'admin.imageUrl': 'Image URL',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.delete': 'Delete',
    'admin.edit': 'Edit',
    'admin.productList': 'Product List',
    'admin.noProducts': 'No products added yet',
    'admin.contactInfoTitle': 'Contact Information',
    'admin.whatsappNumber': 'WhatsApp Number for Orders',
    'admin.phoneNumber': 'Phone Number',
    'admin.email': 'Email',
    'admin.saveChanges': 'Save Changes',
    'admin.profileInfo': 'Account Information',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.currentPassword': 'Current Password',
    'admin.newPassword': 'New Password',
    'admin.confirmPassword': 'Confirm Password',
    'admin.updateProfile': 'Update Profile',
    'admin.login': 'Login',
    'admin.loginTitle': 'Login to Admin Dashboard',
    'admin.loginButton': 'Login',
    'admin.credentials': 'Default credentials:',
    'admin.usernamePlaceholder': 'Enter username',
    'admin.passwordPlaceholder': 'Enter password',
    'admin.language': 'Language',
    'admin.arabic': 'Arabic',
    'admin.english': 'English',
    'admin.actions': 'Actions',
    'admin.selectCategory': 'Select Category',
    'admin.food': 'Food',
    'admin.sweets': 'Sweets',
    'admin.crafts': 'Handmade Crafts',
    'admin.areYouSure': 'Are you sure?',
    'admin.deleteConfirm': 'Are you sure you want to delete this product?',
    'admin.changesSaved': 'Changes saved successfully',
    'admin.profileUpdated': 'Profile updated successfully',
    'admin.invalidCredentials': 'Invalid username or password',
    'admin.passwordsDontMatch': 'Passwords do not match',
    'admin.invalidCurrentPassword': 'Current password is incorrect',
    'admin.requiredField': 'This field is required',
    'admin.invalidEmail': 'Invalid email address',
    'admin.invalidPhone': 'Invalid phone number',
    'admin.invalidUrl': 'Invalid image URL',
    'admin.invalidPrice': 'Price must be a number greater than 0',
    'admin.welcome': 'Welcome,',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};