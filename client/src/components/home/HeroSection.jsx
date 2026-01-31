import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section className="text-center mb-6 animate-in fade-in duration-700">
            <h1 className="text-3xl md:text-4xl font-medium text-slate-600 tracking-tight leading-tight">
                Obtenir le meilleur de <span className="bg-gradient-to-r from-[#B88644] via-[#E6C15A] to-[#B88644] bg-clip-text text-transparent">mon IA</span> avec <span className="bg-gradient-to-r from-[#B88644] via-[#E6C15A] to-[#B88644] bg-clip-text text-transparent">Virgile</span>
            </h1>
        </section>
    );
};

export default HeroSection;
