import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { I18nManager } from 'react-native';
import { secureStorage } from '../services/secureStorage';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  toggleLanguage: () => Promise<void>;
  t: (key: string) => string;
}

// Simple translation dictionary
const translations = {
  en: {
    // Navigation
    'nav.home': 'Event Discovery',
    'nav.profile': 'Profile',
    'nav.favorites': 'Favorites',
    'nav.eventDetails': 'Event Details',
    'nav.login': 'Login',
    
    // Auth
    'auth.welcome': 'Welcome',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.signOut': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.displayName': 'Display Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.alreadyHaveAccount': 'Already have an account? Sign In',
    'auth.dontHaveAccount': "Don't have an account? Sign Up",
    'auth.accountCreated': 'Account Created',
    'auth.accountCreatedMessage': 'Your account has been created successfully!',
    'auth.signInError': 'Sign In Error',
    'auth.signUpError': 'Sign Up Error',
    'auth.invalidCredentials': 'Invalid credentials',
    'auth.passwordTooShort': 'Invalid email or password too short',
    
    // Home
    'home.searchPlaceholder': 'Search events, cities, venues, or categories...',
    'home.eventsFound': 'events found',
    'home.eventFound': 'event found',
    'home.noEvents': 'No events found',
    'home.trySearching': 'Try searching for "music", "New York", or "comedy"',
    
    // Events
    'event.category': 'Category',
    'event.bookNow': 'Book Now',
    'event.share': 'Share',
    'event.addToFavorites': 'Add to Favorites',
    'event.removeFromFavorites': 'Remove from Favorites',
    
    // Favorites
    'favorites.title': 'My Favorites',
    'favorites.noFavorites': 'No Favorite Events',
    'favorites.noFavoritesMessage': 'Start exploring events and mark them as favorites to see them here!',
    'favorites.exploreEvents': 'Explore Events',
    
    // Profile
    'profile.title': 'Profile',
    'profile.accountInfo': 'Account Information',
    'profile.name': 'Full Name',
    'profile.email': 'Email Address',
    'profile.userId': 'User ID',
    'profile.memberSince': 'Member Since',
    'profile.lastLogin': 'Last Login',
    'profile.favoriteEvents': 'Favorite Events',
    'profile.activity': 'Activity',
    'profile.actions': 'Settings & Actions',
    'profile.viewFavorites': 'View Favorites',
    'profile.editProfile': 'Edit Profile',
    'profile.signOut': 'Sign Out',
    'profile.signOutConfirm': 'Are you sure you want to sign out?',
    'profile.cancel': 'Cancel',
    'profile.notProvided': 'Not Provided',
    'profile.notAvailable': 'Not Available',
    'profile.language': 'Language',
    'profile.english': 'English',
    'profile.arabic': 'العربية',
    
    // Event Details
    'eventDetails.dateTime': 'Date & Time',
    'eventDetails.venue': 'Venue',
    'eventDetails.priceRange': 'Price Range',
    'eventDetails.pricesVary': 'Prices vary by seating',
    'eventDetails.aboutEvent': 'About This Event',
    'eventDetails.eventDetails': 'Event Details',
    'eventDetails.ageRestriction': 'Age Restriction',
    'eventDetails.ageRequired': '18+ (ID Required)',
    'eventDetails.doorsOpen': 'Doors Open',
    'eventDetails.doorsTime': '6:30 PM',
    'eventDetails.parking': 'Parking',
    'eventDetails.parkingInfo': 'Available on-site ($15)',
    'eventDetails.dressCode': 'Dress Code',
    'eventDetails.dressCodeInfo': 'Casual to Smart Casual',
    'eventDetails.bookNow': 'Book Now',
    'eventDetails.shareEvent': 'Share Event',
    'eventDetails.booking': 'Booking',
    'eventDetails.bookingMessage': 'Booking functionality would be implemented here!',
    'eventDetails.shareTitle': 'Share Event',
    'eventDetails.shareMessage': 'Share "{eventName}" with friends!',
    'eventDetails.error': 'Error',
    'eventDetails.favoritesError': 'Failed to update favorites',
    'eventDetails.eventTime': '7:00 PM - 10:00 PM',
    'eventDetails.location': 'Location',
    'eventDetails.description': 'About This Event',
    'eventDetails.additionalInfo': 'Additional Information', 
    'eventDetails.date': 'Date & Time',
    'eventDetails.category': 'Category',
    'eventDetails.tapToViewMap': 'Tap to view on map',
    'eventDetails.mapError': 'Unable to open map',
    
    // Common
    'common.or': 'or',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.ok': 'OK',
  },
  ar: {
    // Navigation
    'nav.home': 'اكتشاف الأحداث',
    'nav.profile': 'الملف الشخصي',
    'nav.favorites': 'المفضلة',
    'nav.eventDetails': 'تفاصيل الحدث',
    'nav.login': 'تسجيل الدخول',
    
    // Auth
    'auth.welcome': 'مرحباً',
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'إنشاء حساب',
    'auth.signOut': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.displayName': 'الاسم',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.alreadyHaveAccount': 'لديك حساب؟ سجل الدخول',
    'auth.dontHaveAccount': 'ليس لديك حساب؟ أنشئ حساباً',
    'auth.accountCreated': 'تم إنشاء الحساب',
    'auth.accountCreatedMessage': 'تم إنشاء حسابك بنجاح!',
    'auth.signInError': 'خطأ في تسجيل الدخول',
    'auth.signUpError': 'خطأ في إنشاء الحساب',
    'auth.invalidCredentials': 'بيانات خاطئة',
    'auth.passwordTooShort': 'البريد الإلكتروني خاطئ أو كلمة المرور قصيرة',
    
    // Home
    'home.searchPlaceholder': 'ابحث عن الأحداث والمدن والأماكن والفئات...',
    'home.eventsFound': 'حدث موجود',
    'home.eventFound': 'حدث موجود',
    'home.noEvents': 'لا توجد أحداث',
    'home.trySearching': 'جرب البحث عن "موسيقى" أو "نيويورك" أو "كوميديا"',
    
    // Events
    'event.category': 'الفئة',
    'event.bookNow': 'احجز الآن',
    'event.share': 'مشاركة',
    'event.addToFavorites': 'أضف للمفضلة',
    'event.removeFromFavorites': 'إزالة من المفضلة',
    
    // Favorites
    'favorites.title': 'مفضلتي',
    'favorites.noFavorites': 'لا توجد أحداث مفضلة',
    'favorites.noFavoritesMessage': 'ابدأ في استكشاف الأحداث وأضفها للمفضلة لتراها هنا!',
    'favorites.exploreEvents': 'استكشف الأحداث',
    
    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.accountInfo': 'معلومات الحساب',
    'profile.name': 'الاسم الكامل',
    'profile.email': 'البريد الإلكتروني',
    'profile.userId': 'معرف المستخدم',
    'profile.memberSince': 'عضو منذ',
    'profile.lastLogin': 'آخر تسجيل دخول',
    'profile.favoriteEvents': 'الأحداث المفضلة',
    'profile.activity': 'النشاط',
    'profile.actions': 'الإعدادات والإجراءات',
    'profile.viewFavorites': 'عرض المفضلة',
    'profile.editProfile': 'تعديل الملف الشخصي',
    'profile.signOut': 'تسجيل الخروج',
    'profile.signOutConfirm': 'هل أنت متأكد من تسجيل الخروج؟',
    'profile.cancel': 'إلغاء',
    'profile.notProvided': 'غير محدد',
    'profile.notAvailable': 'غير متوفر',
    'profile.language': 'اللغة',
    'profile.english': 'English',
    'profile.arabic': 'العربية',
    
    // Event Details
    'eventDetails.dateTime': 'التاريخ والوقت',
    'eventDetails.venue': 'المكان',
    'eventDetails.priceRange': 'نطاق الأسعار',
    'eventDetails.pricesVary': 'الأسعار تختلف حسب المقاعد',
    'eventDetails.aboutEvent': 'حول هذا الحدث',
    'eventDetails.eventDetails': 'تفاصيل الحدث',
    'eventDetails.ageRestriction': 'قيود العمر',
    'eventDetails.ageRequired': '18+ (هوية مطلوبة)',
    'eventDetails.doorsOpen': 'فتح الأبواب',
    'eventDetails.doorsTime': '6:30 مساءً',
    'eventDetails.parking': 'موقف السيارات',
    'eventDetails.parkingInfo': 'متوفر في الموقع (15 دولار)',
    'eventDetails.dressCode': 'قواعد اللباس',
    'eventDetails.dressCodeInfo': 'عادي إلى أنيق عادي',
    'eventDetails.bookNow': 'احجز الآن',
    'eventDetails.shareEvent': 'مشاركة الحدث',
    'eventDetails.booking': 'الحجز',
    'eventDetails.bookingMessage': 'سيتم تنفيذ وظيفة الحجز هنا!',
    'eventDetails.shareTitle': 'مشاركة الحدث',
    'eventDetails.shareMessage': 'مشاركة "{eventName}" مع الأصدقاء!',
    'eventDetails.error': 'خطأ',
    'eventDetails.favoritesError': 'فشل في تحديث المفضلة',
    'eventDetails.eventTime': '7:00 مساءً - 10:00 مساءً',
    'eventDetails.location': 'الموقع',
    'eventDetails.description': 'حول هذا الحدث',
    'eventDetails.additionalInfo': 'معلومات إضافية',
    'eventDetails.date': 'التاريخ والوقت', 
    'eventDetails.category': 'الفئة',
    'eventDetails.tapToViewMap': 'اضغط للعرض على الخريطة',
    'eventDetails.mapError': 'غير قادر على فتح الخريطة',
    
    // Common
    'common.or': 'أو',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.ok': 'موافق',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedPreferences = await secureStorage.getAppPreferences();
      if (savedPreferences?.language) {
        const lang = savedPreferences.language as Language;
        setLanguage(lang);
        const rtl = lang === 'ar';
        setIsRTL(rtl);
        
        // Apply RTL layout
        I18nManager.forceRTL(rtl);
      }
    } catch (error) {
      console.error('Failed to load language preferences:', error);
      // Set defaults on error
      setLanguage('en');
      setIsRTL(false);
    }
  };

  const toggleLanguage = async () => {
    try {
      const newLanguage: Language = language === 'en' ? 'ar' : 'en';
      const newIsRTL = newLanguage === 'ar';
      
      // Update state immediately
      setLanguage(newLanguage);
      setIsRTL(newIsRTL);
      
      // Get current preferences or use defaults
      const currentPreferences = await secureStorage.getAppPreferences();
      const updatedPreferences = {
        theme: currentPreferences?.theme || 'light' as const,
        notifications: currentPreferences?.notifications ?? true,
        biometricEnabled: currentPreferences?.biometricEnabled ?? false,
        language: newLanguage,
        isRTL: newIsRTL,
      };
      
      // Save updated preferences
      await secureStorage.storeAppPreferences(updatedPreferences);
      
      // Apply RTL layout
      I18nManager.forceRTL(newIsRTL);
      
      console.log(`Language switched to: ${newLanguage}, RTL: ${newIsRTL}`);
      
    } catch (error) {
      console.error('Failed to toggle language:', error);
      // Revert state on error
      setLanguage(language);
      setIsRTL(!isRTL);
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[language];
    const translation = (currentTranslations as any)[key];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key; // Return the key itself as fallback
    }
    
    return translation;
  };

  const value: LanguageContextType = {
    language,
    isRTL,
    toggleLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;