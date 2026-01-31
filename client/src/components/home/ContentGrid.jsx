import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import virgilBust from '../../assets/images/virgil_bust.png';

const ContentGrid = () => {
    const { t } = useTranslation();

    const cards = [
        { title: t('cell2_title'), text: t('cell2_text') },
        { title: t('cell1_title'), text: t('cell1_text') },
        { title: t('cell3_title'), text: t('cell3_text') },
        { title: t('cell4_title'), text: t('cell4_text') }
    ];

    return (
        <div className="relative w-full max-w-5xl mx-auto py-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 rounded-[32px] overflow-hidden border border-slate-100 shadow-xl relative z-10">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-8 md:p-12 hover:bg-slate-50 transition-colors">
                        <div className="h-full flex flex-col justify-center">
                            <h3 className="font-bold text-slate-900 text-sm md:text-base mb-3 leading-tight">{card.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-xs md:text-sm font-medium">
                                {card.text}
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Center Logo - Desktop Only */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block pointer-events-none">
                <div className="bg-white rounded-full p-3 shadow-2xl ring-8 ring-white w-36 h-36 flex items-center justify-center overflow-hidden border border-slate-100 group">
                    <img
                        src={virgilBust}
                        alt="Virgil"
                        className="w-24 h-24 object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
            </div>
        </div>
    );
};

export default ContentGrid;
