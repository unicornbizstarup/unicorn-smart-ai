
import React, { useState } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSelector: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'th', name: 'ไทย', flag: '🇹🇭' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'mm', name: 'မြန်မာ', flag: '🇲🇲' },
    ];

    const currentLang = languages.find(l => l.code === language);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/40 shadow-sm hover:bg-white/60 transition-all group"
            >
                <Languages size={18} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">
                    {currentLang?.code}
                </span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full mb-2 right-0 w-48 bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 block">
                                {t('common.select_lang')}
                            </span>
                        </div>
                        <div className="p-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as any);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all ${language === lang.code
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'hover:bg-blue-50 text-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{lang.flag}</span>
                                        <span className="text-sm font-bold">{lang.name}</span>
                                    </div>
                                    {language === lang.code && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSelector;
