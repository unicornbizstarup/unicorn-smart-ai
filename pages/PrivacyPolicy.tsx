
import React from 'react';
import {
    ShieldAlert,
    Lock,
    EyeOff,
    UserCheck,
    Files,
    ArrowLeft,
    Scale,
    ShieldCheck
} from 'lucide-react';
import { AppView } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface PrivacyPolicyProps {
    onNavigate: (view: AppView) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 animate-fade-in relative overflow-hidden pb-20 font-inter">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate(AppView.LANDING)}
                    className="group mb-12 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    {t('common.back')}
                </button>

                {/* Hero Section */}
                <div className="mb-16 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <ShieldCheck size={16} className="text-blue-600" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest uppercase">Privacy & Data Protection</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6 uppercase">
                        {t('privacy.title')}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                        {t('privacy.subtitle')}
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-12">

                    {/* Commitment Message */}
                    <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors pointer-events-none" />
                        <div className="relative z-10 flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <Lock size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-2 uppercase">{t('privacy.commitment.title')}</h3>
                                <p className="text-blue-50 font-medium leading-relaxed">
                                    {t('privacy.commitment.desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section: Data Collection */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3 uppercase">
                            <Files className="text-blue-500" size={24} />
                            {t('privacy.data.title')}
                        </h2>
                        <div className="space-y-4 text-slate-600 font-medium">
                            <p>{t('privacy.data.desc')}</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>{t('privacy.data.list1')}</li>
                                <li>{t('privacy.data.list2')}</li>
                                <li>{t('privacy.data.list3')}</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Purpose */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3 uppercase">
                            <UserCheck className="text-slate-900" size={24} />
                            {t('privacy.purpose.title')}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="font-black text-slate-900 mb-2 uppercase">{t('privacy.purpose.service.title')}</h4>
                                <p className="text-sm text-slate-500">{t('privacy.purpose.service.desc')}</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <h4 className="font-black text-slate-900 mb-2 uppercase">{t('privacy.purpose.dev.title')}</h4>
                                <p className="text-sm text-slate-500">{t('privacy.purpose.dev.desc')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Security */}
                    <section>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-3 uppercase">
                            <ShieldAlert className="text-rose-500" size={24} />
                            {t('privacy.security.title')}
                        </h2>
                        <p className="text-slate-600 font-medium leading-relaxed mb-6">
                            {t('privacy.security.desc')}
                        </p>
                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Scale size={18} className="text-amber-600" />
                                <span className="text-xs font-black text-amber-700 uppercase tracking-widest uppercase">Compliance</span>
                            </div>
                            <p className="text-sm text-amber-900 font-bold uppercase tracking-tight">{t('privacy.security.compliance')}</p>
                        </div>
                    </section>

                    {/* Section: Rights */}
                    <section className="pt-8 border-t border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">{t('privacy.rights.title')}</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {t('privacy.rights.desc')}
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                            <EyeOff size={16} />
                            {t('privacy.no_share')}
                        </div>
                    </section>

                </div>

                {/* Footer info */}
                <div className="mt-12 text-center text-slate-400 text-[10px] font-black leading-loose uppercase tracking-widest">
                    <p>{t('privacy.updated')}</p>
                    <p>{t('privacy.prepared')}</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
