import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppContext';
import { navigateTo } from '../../hooks/useRouting';
import virggilImage from '../../assets/images/virggil.webp';

const LandingHero = () => {
    const { t } = useTranslation();
    const { user, openAuthModal } = useAuth();
    const { dispatch } = useAppState();

    const renderHighlighted = (text) => {
        const parts = text.split(/(<h>.*?<\/h>)/g);
        return parts.map((part, i) => {
            const match = part.match(/^<h>(.*)<\/h>$/);
            if (match) {
                return (
                    <span
                        key={i}
                        className="bg-clip-text text-transparent brand-protect"
                        style={{ backgroundImage: 'radial-gradient(circle, #D9B06A 0%, #B88644 60%, #8C6230 100%)', colorScheme: 'light only' }}
                    >
                        {match[1]}
                    </span>
                );
            }
            return part;
        });
    };

    const handleCTA = () => {
        if (user) {
            navigateTo(dispatch, 'home');
        } else {
            openAuthModal();
        }
    };

    const scrollToHowItWorks = () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
        <section className="pt-8 md:pt-12 pb-10 px-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
                        {renderHighlighted(t('landing_hero_title'))}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 max-w-xl">
                        {t('landing_hero_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                        <button
                            onClick={handleCTA}
                            className="px-8 py-3.5 bg-[#B88644] text-white text-base font-bold rounded-full hover:bg-[#a6763b] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#B88644]/20 brand-protect"
                        >
                            {t('landing_hero_cta')}
                        </button>
                        <button
                            onClick={scrollToHowItWorks}
                            className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline underline-offset-4"
                        >
                            {t('landing_hero_secondary')}
                        </button>
                    </div>
                    <p className="text-sm font-medium text-[#8C6230]/80">{t('landing_hero_trust')}</p>
                </div>
                <div className="flex-shrink-0">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                            src={virggilImage}
                            alt="Virgil"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
        </>
    );
};

export default LandingHero;
