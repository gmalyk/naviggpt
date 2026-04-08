import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const LandingTestimonials = () => {
    const { t } = useTranslation();

    const testimonials = [
        {
            text: t('landing_testimonial_1_text'),
            author: t('landing_testimonial_1_author'),
            role: t('landing_testimonial_1_role'),
            stars: 5,
        },
        {
            text: t('landing_testimonial_2_text'),
            author: t('landing_testimonial_2_author'),
            role: t('landing_testimonial_2_role'),
            stars: 5,
        },
        {
            text: t('landing_testimonial_3_text'),
            author: t('landing_testimonial_3_author'),
            role: t('landing_testimonial_3_role'),
            stars: 5,
        },
    ];

    return (
        <section className="py-12 px-6 max-w-6xl mx-auto">
            <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                    {t('landing_testimonials_title')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                    <div key={idx} className="rounded-3xl bg-slate-50 border border-slate-100 p-8 flex flex-col">
                        <div
                            className="text-4xl font-serif leading-none mb-4 bg-clip-text text-transparent brand-protect"
                            style={{ backgroundImage: 'radial-gradient(circle, #D9B06A 0%, #B88644 60%, #8C6230 100%)', colorScheme: 'light only' }}
                        >
                            "
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed flex-grow mb-6">
                            {testimonial.text}
                        </p>
                        <div className="flex items-center gap-1 mb-3">
                            {Array.from({ length: testimonial.stars }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-[#B88644] text-[#B88644] brand-protect" />
                            ))}
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{testimonial.author}</p>
                        <p className="text-xs text-slate-400">{testimonial.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LandingTestimonials;
