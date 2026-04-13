import React from 'react';
import { Key, Compass } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const LandingFeatures = () => {
    const { t } = useTranslation();

    return (
        <section className="py-12 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                    {t('landing_features_title')}
                </h2>
            </div>

            {/* Feature 1: Discernment Keys */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-20">
                <div className="flex-1 order-2 md:order-1">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7B8FA3]/10 mb-4">
                        <Key className="w-6 h-6 text-[#7B8FA3] brand-protect" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                        {t('landing_feat_keys_title')}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                        {t('landing_feat_keys_text')}
                    </p>
                </div>
                <div className="flex-1 order-1 md:order-2">
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
                        <div className="space-y-3">
                            {['landing_feat_keys_filter1', 'landing_feat_keys_filter2', 'landing_feat_keys_filter3'].map((key, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 px-4 py-3">
                                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-[#7B8FA3]' : i === 1 ? 'bg-[#9BB0C4]' : 'bg-[#8AA0B8]'}`} />
                                    <span className="text-sm text-slate-600">{t(key)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature 2: Values Compass */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1">
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: t('landing_feat_compass_cat1'), color: 'bg-[#7B8FA3]' },
                                { label: t('landing_feat_compass_cat2'), color: 'bg-[#9BB0C4]' },
                                { label: t('landing_feat_compass_cat3'), color: 'bg-[#8AA0B8]' },
                                { label: t('landing_feat_compass_cat4'), color: 'bg-[#6E8496]' },
                            ].map((cat, i) => (
                                <div key={i} className="rounded-xl bg-white border border-slate-100 px-4 py-3 flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                                    <span className="text-sm text-slate-600">{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7B8FA3]/10 mb-4">
                        <Compass className="w-6 h-6 text-[#7B8FA3] brand-protect" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">
                        {t('landing_feat_compass_title')}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                        {t('landing_feat_compass_text')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LandingFeatures;
