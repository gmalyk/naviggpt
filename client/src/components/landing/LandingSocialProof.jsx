import React from 'react';
import { Globe, Users, Shield, UserCheck } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const LandingSocialProof = () => {
    const { t } = useTranslation();

    const stats = [
        { icon: Globe, value: '10+', label: t('landing_proof_languages') },
        { icon: Users, value: '4', label: t('landing_proof_profiles') },
        { icon: Shield, value: '100%', label: t('landing_proof_private') },
        { icon: UserCheck, value: '1k+', label: t('landing_proof_users') },
    ];

    return (
        <section className="py-8 bg-slate-50 border-y border-slate-100">
            <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <stat.icon className="w-5 h-5 text-[#B88644] brand-protect" />
                        <div>
                            <span className="text-lg font-bold text-slate-800">{stat.value}</span>
                            <span className="text-sm text-slate-500 ml-1.5">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LandingSocialProof;
