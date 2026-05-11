import { Tractor } from 'lucide-react';
import { Language } from '../types';
import { cn } from '../lib/utils';
import { translations } from '../i18n';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
}

export default function Header({ language, onToggleLanguage }: HeaderProps) {
  const t = translations[language];

  return (
    <header className="px-5 py-4 flex justify-between items-center bg-white sticky top-0 z-20">
      <button 
        onClick={onToggleLanguage}
        className="px-4 py-1.5 rounded-full bg-[#f0fdf4] text-[#1a531b] text-sm font-bold flex items-center gap-2 border border-[#dcfce7]"
      >
        <span className={cn(language === 'ur' && "urdu-text")}>
          {t.languageToggle}
        </span>
      </button>

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-[#1a531b]">{t.appName}</h1>
        <Tractor className="text-[#1a531b]" size={24} />
      </div>

      {/* Profile/User Icon or Menu could go here, but matching screenshot */}
      <div className="w-8 h-8 rounded-full bg-[#1a531b]/10 invisible" />
    </header>
  );
}
