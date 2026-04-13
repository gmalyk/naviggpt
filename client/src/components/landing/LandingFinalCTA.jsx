import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppState } from '../../context/AppContext';
import { navigateTo } from '../../hooks/useRouting';

const LandingFinalCTA = () => {
    const { t } = useTranslation();
    const { dispatch } = useAppState();

    const handleCTA = () => {
        navigateTo(dispatch, 'home');
    };

    return (
        <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                    {t('landing_final_title')}
                </h2>
                <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                    {t('landing_final_subtitle')}
                </p>
                <button
                    onClick={handleCTA}
                    className="px-10 py-4 bg-[#7B8FA3] text-white text-lg font-bold rounded-full hover:bg-[#a6763b] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#7B8FA3]/20 brand-protect"
                >
                    {t('landing_final_cta')}
                </button>
            </div>
        </section>
    );
};

export default LandingFinalCTA;
