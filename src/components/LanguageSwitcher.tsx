import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

type Language = 'en' | 'ar' | 'sv';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇾' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;

  useEffect(() => {
    // Set HTML dir and lang attributes on mount and language change
    if (currentLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const handleLanguageChange = (langCode: Language) => {
    i18n.changeLanguage(langCode);
    
    // Set HTML dir attribute for RTL
    if (langCode === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = langCode;
    }
    
    // Store preference
    localStorage.setItem('preferred-language', langCode);
  };

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.flag} {currentLang.nativeName}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.nativeName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* 
=== i18n Implementation Guide ===

1. Install dependencies:
   npm install react-i18next i18next

2. Create i18n config (src/i18n.ts):

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../public/locales/en.json';
import ar from '../public/locales/ar.json';
import sv from '../public/locales/sv.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      sv: { translation: sv },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

3. Import in main.tsx:
import './i18n';

4. Use in components:
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button onClick={() => i18n.changeLanguage('ar')}>
        العربية
      </button>
    </div>
  );
}

5. Update LanguageSwitcher to use i18n:
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
const handleLanguageChange = (langCode: Language) => {
  i18n.changeLanguage(langCode);
  // ... rest of the function
};

6. Product multilingual rendering:
// Instead of hardcoded product.title.en
const { i18n } = useTranslation();
const lang = i18n.language as 'en' | 'ar' | 'sv';
return <h1>{product.title[lang]}</h1>;
*/

export default LanguageSwitcher;
