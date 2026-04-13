import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppState } from '../../context/AppContext';
import { navigateTo } from '../../hooks/useRouting';
import { ShieldCheck, EyeOff, UserCheck, Scale, Sparkles, Bot, MessageSquare, CheckCircle, Key, Compass, Star, AlertTriangle, Brain, GraduationCap, Users } from 'lucide-react';
import virggilImage from '../../assets/images/virggil.webp';

const InstitutionsView = () => {
    const { t } = useTranslation();
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
                        style={{ backgroundImage: 'radial-gradient(circle, #A3B5C7 0%, #7B8FA3 60%, #4A5E72 100%)', colorScheme: 'light only' }}
                    >
                        {match[1]}
                    </span>
                );
            }
            return part;
        });
    };

    const handleContact = () => {
        navigateTo(dispatch, 'contact');
    };

    // --- Problem stats ---
    const problemStats = [
        { icon: AlertTriangle, value: t('inst_stat1_value'), label: t('inst_stat1_label') },
        { icon: Brain, value: t('inst_stat2_value'), label: t('inst_stat2_label') },
        { icon: Users, value: t('inst_stat3_value'), label: t('inst_stat3_label') },
    ];

    // --- How it works steps ---
    const steps = [
        { number: '1', icon: UserCheck, title: t('inst_step1_title'), text: t('inst_step1_text') },
        { number: '2', icon: Compass, title: t('inst_step2_title'), text: t('inst_step2_text') },
        { number: '3', icon: GraduationCap, title: t('inst_step3_title'), text: t('inst_step3_text') },
    ];

    // --- Testimonials ---
    const testimonials = [
        { text: t('inst_testimonial_1_text'), author: t('inst_testimonial_1_author'), role: t('inst_testimonial_1_role'), stars: 5 },
        { text: t('inst_testimonial_2_text'), author: t('inst_testimonial_2_author'), role: t('inst_testimonial_2_role'), stars: 5 },
        { text: t('inst_testimonial_3_text'), author: t('inst_testimonial_3_author'), role: t('inst_testimonial_3_role'), stars: 5 },
    ];

    // --- Trust items ---
    const trustItems = [
        { icon: ShieldCheck, label: t('inst_trust_no_data_sale') },
        { icon: EyeOff, label: t('inst_trust_no_ads') },
        { icon: UserCheck, label: t('inst_trust_age_appropriate') },
        { icon: Scale, label: t('inst_trust_no_sycophancy') },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            {/* Banner */}
            <div className="-mt-6 bg-gradient-to-r from-[#7B8FA3]/15 via-[#95A8BA]/15 to-[#7B8FA3]/15 border-b border-[#7B8FA3]/30">
                <p className="text-center text-sm font-semibold text-[#4A5E72] py-3 px-6 max-w-4xl mx-auto">
                    {t('inst_banner')}
                </p>
            </div>

            {/* Hero */}
            <section className="pt-8 md:pt-12 pb-10 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 tracking-tight leading-tight mb-6">
                            {renderHighlighted(t('inst_hero_title'))}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 max-w-xl">
                            {t('inst_hero_subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                            <button
                                onClick={handleContact}
                                className="px-8 py-3.5 bg-[#7B8FA3] text-white text-base font-bold rounded-full hover:bg-[#5A7085] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#7B8FA3]/20 brand-protect"
                            >
                                {t('inst_hero_cta')}
                            </button>
                            <button
                                onClick={() => document.getElementById('inst-how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline underline-offset-4"
                            >
                                {t('inst_hero_secondary')}
                            </button>
                        </div>
                        <p className="text-sm font-medium text-[#4A5E72]/80">{t('inst_hero_trust')}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center overflow-hidden">
                            <img src={virggilImage} alt="NavigGPT" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[32px] p-10 md:p-14">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
                        {t('inst_problem_title')}
                    </h2>
                    <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
                        {t('inst_problem_subtitle')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {problemStats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-[#A3B5C7]" />
                                </div>
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                                <p className="text-sm text-slate-300 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-12 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                        {t('inst_compare_title')}
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        {t('inst_compare_subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Standard AI */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-slate-500" />
                            </div>
                            <p className="font-semibold text-slate-600">{t('inst_compare_other_label')}</p>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed flex-grow">
                            {t('inst_compare_other_text')}
                        </p>
                    </div>

                    {/* NavigGPT */}
                    <div className="rounded-3xl border-2 border-[#7B8FA3]/30 bg-white p-8 flex flex-col shadow-lg shadow-[#7B8FA3]/5 relative">
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-[#7B8FA3] text-white text-xs font-bold rounded-full brand-protect">
                            {t('inst_compare_badge')}
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#7B8FA3]/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#7B8FA3] brand-protect" />
                            </div>
                            <p className="font-semibold text-slate-800">NavigGPT</p>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed flex-grow">
                            {t('inst_compare_virggil_text')}
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="inst-how-it-works" className="py-12 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                            {t('inst_howitworks_title')}
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            {t('inst_howitworks_subtitle')}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="rounded-3xl border border-slate-200 bg-white p-8 text-center hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-[#7B8FA3] text-white flex items-center justify-center mx-auto mb-5 text-lg font-bold brand-protect">
                                    {step.number}
                                </div>
                                <step.icon className="w-8 h-8 text-[#7B8FA3] mx-auto mb-4 brand-protect" />
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        {t('inst_features_title')}
                    </h2>
                </div>

                {/* Discernment Keys */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-20">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#7B8FA3]/10 mb-4">
                            <Key className="w-6 h-6 text-[#7B8FA3] brand-protect" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            {t('inst_feat_keys_title')}
                        </h3>
                        <p className="text-slate-500 leading-relaxed">
                            {t('inst_feat_keys_text')}
                        </p>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
                            <div className="space-y-3">
                                {['inst_feat_keys_filter1', 'inst_feat_keys_filter2', 'inst_feat_keys_filter3'].map((key, i) => (
                                    <div key={i} className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 px-4 py-3">
                                        <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-[#7B8FA3]' : i === 1 ? 'bg-[#9BB0C4]' : 'bg-[#8AA0B8]'}`} />
                                        <span className="text-sm text-slate-600">{t(key)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Compass */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="flex-1">
                        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: t('inst_feat_compass_cat1'), color: 'bg-[#7B8FA3]' },
                                    { label: t('inst_feat_compass_cat2'), color: 'bg-[#9BB0C4]' },
                                    { label: t('inst_feat_compass_cat3'), color: 'bg-[#8AA0B8]' },
                                    { label: t('inst_feat_compass_cat4'), color: 'bg-[#6E8496]' },
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
                            {t('inst_feat_compass_title')}
                        </h3>
                        <p className="text-slate-500 leading-relaxed">
                            {t('inst_feat_compass_text')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        {t('inst_testimonials_title')}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className="rounded-3xl bg-slate-50 border border-slate-100 p-8 flex flex-col">
                            <div
                                className="text-4xl font-serif leading-none mb-4 bg-clip-text text-transparent brand-protect"
                                style={{ backgroundImage: 'radial-gradient(circle, #A3B5C7 0%, #7B8FA3 60%, #4A5E72 100%)', colorScheme: 'light only' }}
                            >
                                "
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed flex-grow mb-6">
                                {testimonial.text}
                            </p>
                            <div className="flex items-center gap-1 mb-3">
                                {Array.from({ length: testimonial.stars }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#7B8FA3] text-[#7B8FA3] brand-protect" />
                                ))}
                            </div>
                            <p className="text-sm font-semibold text-slate-800">{testimonial.author}</p>
                            <p className="text-xs text-slate-400">{testimonial.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust */}
            <section className="py-12 px-6">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[32px] p-10 md:p-14">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
                        {t('inst_trust_title')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {trustItems.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-[#A3B5C7]" />
                                </div>
                                <p className="text-sm text-slate-300 font-medium">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                        {t('inst_final_title')}
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                        {t('inst_final_subtitle')}
                    </p>
                    <button
                        onClick={handleContact}
                        className="px-10 py-4 bg-[#7B8FA3] text-white text-lg font-bold rounded-full hover:bg-[#5A7085] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#7B8FA3]/20 brand-protect"
                    >
                        {t('inst_final_cta')}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default InstitutionsView;
