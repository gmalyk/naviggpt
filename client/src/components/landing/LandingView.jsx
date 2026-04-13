import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';
import LandingHero from './LandingHero';
import LandingSocialProof from './LandingSocialProof';
import LandingComparison from './LandingComparison';
import LandingHowItWorks from './LandingHowItWorks';
import LandingFeatures from './LandingFeatures';
import LandingCompanions from './LandingCompanions';
import LandingTestimonials from './LandingTestimonials';
import LandingTrust from './LandingTrust';
import LandingFinalCTA from './LandingFinalCTA';

const LandingView = () => {
    const { user, loading: authLoading } = useAuth();
    const { dispatch } = useAppState();
    const { t } = useTranslation();

    useEffect(() => {
        if (!authLoading && user) {
            navigateTo(dispatch, 'home', { skipScroll: true });
        }
    }, [user, authLoading, dispatch]);

    if (authLoading || user) return null;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="-mt-6 bg-gradient-to-r from-[#7B8FA3]/15 via-[#D4A24C]/15 to-[#7B8FA3]/15 border-b border-[#7B8FA3]/30">
                <p className="text-center text-sm font-semibold text-[#4A5E72] py-3 px-6 max-w-4xl mx-auto">
                    {t('landing_auth_banner')}
                </p>
            </div>
            <LandingHero />
            <LandingSocialProof />
            <LandingTestimonials />
            <LandingComparison />
            <LandingHowItWorks />
            <LandingFeatures />
            <LandingCompanions />
            <LandingTrust />
            <LandingFinalCTA />
        </div>
    );
};

export default LandingView;
