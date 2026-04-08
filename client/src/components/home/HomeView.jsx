import React from 'react';
import { Zap } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';
import HeroSection from './HeroSection';
import SearchBar from './SearchBar';

const HomeView = () => {
    const { t } = useTranslation();
    const { dispatch } = useAppState();

    return (
        <section className="pb-12 px-6 max-w-6xl mx-auto flex flex-col items-center w-full animate-in fade-in duration-500">
            <div className="w-full flex justify-center mb-2">
                <button
                    onClick={() => navigateTo(dispatch, 'pricing')}
                    title={t('plan_tooltip')}
                    className="group relative flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 hover:border-[#B88644]/40 hover:bg-[#B88644]/5 transition-all"
                >
                    <Zap className="w-3.5 h-3.5 text-[#B88644]" />
                    <span className="text-xs text-slate-500">{t('plan_free_label')}</span>
                    <span className="text-[10px] font-semibold text-[#B88644]">· {t('plan_upgrade_label')}</span>
                    <span className="pointer-events-none absolute top-full mt-1.5 right-0 whitespace-nowrap rounded bg-slate-800 px-2.5 py-1.5 text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                        {t('plan_tooltip')}
                    </span>
                </button>
            </div>
            <HeroSection />
            <SearchBar />
            <p className="mt-2 max-w-3xl text-center text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                {t('home_description')}
            </p>
        </section>
    );
};

export default HomeView;
