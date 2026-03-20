import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import virggilImage from '../../assets/images/virggil.webp';
const AboutView = () => {
    const { t } = useTranslation();

    const sections = [
        { title: t('cell1_title'), text: t('cell1_text') },
        { title: t('cell2_title'), text: t('cell2_text') },
        { title: t('cell3_title'), text: t('cell3_text') },
        { title: t('cell4_title'), text: t('cell4_text') }
    ];

    return (
        <section className="pt-0 pb-12 px-6 max-w-3xl mx-auto flex flex-col items-center w-full animate-in fade-in duration-500">
            <div className="flex justify-center mb-6">
                <div className="w-36 h-36 flex items-center justify-center overflow-hidden rounded-full">
                    <img
                        src={virggilImage}
                        alt="Virggil"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 md:p-10 w-full">
                {sections.map((section, idx) => (
                    <div key={idx} className={idx < sections.length - 1 ? 'mb-6' : ''}>
                        <h3 className="font-bold text-slate-600 text-sm md:text-base mb-1.5">{section.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-xs md:text-sm">{section.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutView;
