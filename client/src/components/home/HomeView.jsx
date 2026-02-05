import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';

const HomeView = () => {
    const { t } = useTranslation();

    return (
        <section className="pb-12 px-6 max-w-6xl mx-auto flex flex-col items-center w-full animate-in fade-in duration-500">
            <HeroSection />
            <SearchBar />
            <p className="mt-2 max-w-3xl text-center text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                {t('home_description')}
            </p>
        </section>
    );
};

export default HomeView;
