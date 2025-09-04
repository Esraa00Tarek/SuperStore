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
    'dashboard': 'لوحة التحكم',
    'products': 'المنتجات',
    'contactInfo': 'معلومات التواصل',
    'profile': 'الملف الشخصي',
    'addProduct': 'إضافة منتج',
    'editProduct': 'تعديل المنتج',
    'productName': 'اسم المنتج',
    'description': 'الوصف',
    'price': 'السعر',
    'category': 'الفئة',
    'imageUrl': 'رابط الصورة',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'delete': 'حذف',
    'edit': 'تعديل',
    'productList': 'قائمة المنتجات',
    'noProducts': 'لا توجد منتجات مضافة',
    'contactInfoTitle': 'معلومات التواصل',
    'whatsappNumber': 'رقم واتساب الطلبات',
    'phoneNumber': 'رقم الهاتف',
    'email': 'البريد الإلكتروني',
    'saveChanges': 'حفظ التغييرات',
    'profileInfo': 'معلومات الحساب',
    'username': 'اسم المستخدم',
    'password': 'كلمة المرور',
    'currentPassword': 'كلمة المرور الحالية',
    'newPassword': 'كلمة المرور الجديدة',
    'confirmPassword': 'تأكيد كلمة المرور',
    'updateProfile': 'تحديث الملف الشخصي',
    'login': 'تسجيل الدخول',
    'loginTitle': 'تسجيل الدخول إلى لوحة التحكم',
    'loginButton': 'تسجيل الدخول',
    'credentials': 'بيانات الدخول الافتراضية:',
    'usernamePlaceholder': 'أدخل اسم المستخدم',
    'passwordPlaceholder': 'أدخل كلمة المرور',
    'language': 'اللغة',
    'arabic': 'العربية',
    'english': 'الإنجليزية',
    'actions': 'الإجراءات',
    'selectCategory': 'اختر الفئة',
    'food': 'طعام',
    'sweets': 'حلويات',
    'crafts': 'حرف يدوية',
    'areYouSure': 'هل أنت متأكد؟',
    'deleteConfirm': 'هل أنت متأكد من حذف هذا المنتج؟',
    'changesSaved': 'تم حفظ التغييرات بنجاح',
    'profileUpdated': 'تم تحديث الملف الشخصي بنجاح',
    'invalidCredentials': 'اسم المستخدم أو كلمة المرور غير صحيحة',
    'passwordsDontMatch': 'كلمتا المرور غير متطابقتين',
    'invalidCurrentPassword': 'كلمة المرور الحالية غير صحيحة',
    'requiredField': 'هذا الحقل مطلوب',
    'invalidEmail': 'البريد الإلكتروني غير صالح',
    'invalidPhone': 'رقم الهاتف غير صالح',
    'invalidUrl': 'رابط الصورة غير صالح',
    'invalidPrice': 'السعر يجب أن يكون رقماً أكبر من الصفر',
    'welcome': 'مرحباً',
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
    'hero.title': 'Welcome To Our Kitchen',
    'hero.subtitle': 'A Community Platform Empowering Women To Sell Homemade Food, Desserts, And Handmade Products',
    'hero.cta': 'Explore Products',
    
    // Categories
    'categories.title': 'Product Categories',
    'categories.meals': 'Cooked Meals',
    'categories.pastries': 'Pastries',
    'categories.sweets': 'Sweets',
    'categories.handmade': 'Handmade Crafts',
    
    // Mission
    'mission.title': 'Our Mission',
    'mission.text': 'We Believe In The Power Of Women In Society And Seek To Economically Empower Them By Supporting Their Small Home-Based Projects And Marketing Their High-Quality Products.',
    
    // Products
    'product.order': 'Order Via WhatsApp',
    'product.price': 'Price',
    
    // About
    'about.title': 'Our Story',
    'about.story': 'Our Kitchen Idea Started From Our Deep Belief In Women\'s Ability To Create And Produce. We Are A Platform That Aims To Connect Creative Women In The Kitchen And Handicrafts With The Local Community.',
    'about.mission.title': 'Our Mission',
    'about.mission.text': 'Economically Empowering Women By Supporting Their Home-Based Projects And Providing A Safe Platform To Display And Sell Their High-Quality Products.',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send',
    'contact.whatsapp': 'Contact Via WhatsApp',
    
    // Admin
    'dashboard': 'Dashboard',
    'products': 'Products',
    'contactInfo': 'Contact Information',
    'profile': 'Profile',
    'addProduct': 'Add Product',
    'editProduct': 'Edit Product',
    'productName': 'Product Name',
    'description': 'Description',
    'price': 'Price',
    'category': 'Category',
    'imageUrl': 'Image URL',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'productList': 'Product List',
    'noProducts': 'No Products Added Yet',
    'contactInfoTitle': 'Contact Information',
    'whatsappNumber': 'WhatsApp Number For Orders',
    'phoneNumber': 'Phone Number',
    'email': 'Email',
    'saveChanges': 'Save Changes',
    'profileInfo': 'Account Information',
    'username': 'Username',
    'password': 'Password',
    'currentPassword': 'Current Password',
    'newPassword': 'New Password',
    'confirmPassword': 'Confirm Password',
    'updateProfile': 'Update Profile',
    'login': 'Login',
    'loginTitle': 'Login To Admin Dashboard',
    'loginButton': 'Login',
    'credentials': 'Default Credentials:',
    'usernamePlaceholder': 'Enter Username',
    'passwordPlaceholder': 'Enter Password',
    'language': 'Language',
    'arabic': 'Arabic',
    'english': 'English',
    'actions': 'Actions',
    'selectCategory': 'Select Category',
    'food': 'Food',
    'sweets': 'Sweets',
    'crafts': 'Handmade Crafts',
    'areYouSure': 'Are You Sure?',
    'deleteConfirm': 'Are You Sure You Want To Delete This Product?',
    'changesSaved': 'Changes Saved Successfully',
    'profileUpdated': 'Profile Updated Successfully',
    'invalidCredentials': 'Invalid Username Or Password',
    'passwordsDontMatch': 'Passwords Do Not Match',
    'invalidCurrentPassword': 'Current Password Is Incorrect',
    'requiredField': 'This Field Is Required',
    'invalidEmail': 'Invalid Email Address',
    'invalidPhone': 'Invalid Phone Number',
    'invalidUrl': 'Invalid Image URL',
    'invalidPrice': 'Price Must Be A Number Greater Than 0',
    'welcome': 'Welcome,',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An Error Occurred',
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