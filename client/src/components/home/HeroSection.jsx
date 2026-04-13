import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppState } from '../../context/AppContext';

const HeroSection = () => {
    const { t } = useTranslation();
    const { state } = useAppState();

    const renderHighlighted = (text) => {
        const parts = text.split(/(<h>.*?<\/h>)/g);
        return parts.map((part, i) => {
            const match = part.match(/^<h>(.*)<\/h>$/);
            if (match) {
                return (
                    <span
                        key={i}
                        className="bg-clip-text text-transparent brand-protect"
                        style={{ backgroundImage: 'radial-gradient(circle, #D9B06A 0%, #B88644 60%, #8C6230 100%)', colorScheme: 'light only', WebkitTextFillColor: 'transparent', forcedColorAdjust: 'none' }}
                    >
                        {match[1]}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <section className="text-center mb-6 animate-in fade-in duration-700">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-600 tracking-tight leading-tight">
                {renderHighlighted(state.dialogueActive ? t('hero_title_companion') : t('hero_title'))}
            </h1>
        </section>
    );
};

export default HeroSection;
