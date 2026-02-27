import React from 'react';
import { AppView } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface GlobalFooterProps {
    onNavigate: (view: AppView) => void;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    return (
        <footer className="border-t border-white/5 py-16 bg-slate-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-xl text-slate-950 shadow-xl shadow-amber-500/20">U</div>
                            <h1 className="text-2xl font-black tracking-tighter text-white">UNICORN Academy</h1>
                        </div>
                        <p className="text-slate-500 text-sm max-w-sm text-center md:text-left font-medium">
                            {t('common.footer_desc')}
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-6">
                        <div className="flex items-center gap-8">
                            <button onClick={() => onNavigate(AppView.ABOUT)} className="text-sm text-slate-400 hover:text-amber-500 transition-colors font-bold uppercase tracking-widest">{t('nav.about')}</button>
                            <button onClick={() => onNavigate(AppView.CONTACT)} className="text-sm text-slate-400 hover:text-amber-500 transition-colors font-bold uppercase tracking-widest">{t('nav.contact')}</button>
                            <button onClick={() => onNavigate(AppView.PRIVACY_POLICY)} className="text-sm text-slate-400 hover:text-amber-500 transition-colors font-bold uppercase tracking-widest">{t('nav.privacy')}</button>
                        </div>
                        <p className="text-xs text-slate-600 font-bold tracking-widest uppercase">
                            © 2026 Unicorn Global Link. UNICORN ACADEMY
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default GlobalFooter;
