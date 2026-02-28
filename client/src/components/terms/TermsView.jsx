import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const TermsView = () => {
    const { t } = useTranslation();

    const sections = [
        { title: t('terms_s1_title'), text: t('terms_s1_text') },
        { title: t('terms_s2_title'), text: t('terms_s2_text') },
        { title: t('terms_s3_title'), text: t('terms_s3_text') },
        { title: t('terms_s4_title'), text: t('terms_s4_text') },
        { title: t('terms_s5_title'), text: t('terms_s5_text') },
        { title: t('terms_s6_title'), text: t('terms_s6_text') },
        { title: t('terms_s7_title'), text: t('terms_s7_text') },
        { title: t('terms_s8_title'), text: t('terms_s8_text') },
        { title: t('terms_s9_title'), text: t('terms_s9_text') },
        { title: t('terms_s10_title'), text: t('terms_s10_text') }
    ];

    return (
        <section className="py-12 px-6 max-w-3xl mx-auto flex flex-col items-center w-full animate-in fade-in duration-500">
            <div className="flex justify-center mb-8">
                <div className="bg-white rounded-full p-1 shadow-xl ring-8 ring-white w-28 h-28 flex items-center justify-center overflow-hidden border border-slate-100">
                    <ShieldCheck className="w-14 h-14 text-[#B88644] brand-protect" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">{t('terms_title')}</h1>
            <p className="text-xs text-slate-400 mb-8 text-center">{t('terms_last_updated')}</p>

            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 md:p-10 w-full">
                <p className="text-slate-600 leading-relaxed text-xs md:text-sm mb-6">{t('terms_intro')}</p>

                {sections.map((section, idx) => (
                    <div key={idx} className={idx < sections.length - 1 ? 'mb-6' : ''}>
                        <h3 className="font-bold text-slate-900 text-sm md:text-base mb-1.5">
                            {idx + 1}. {section.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-xs md:text-sm whitespace-pre-line">{section.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TermsView;
