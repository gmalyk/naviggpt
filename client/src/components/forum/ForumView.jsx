import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const ForumView = () => {
    const { t } = useTranslation();

    return (
        <section className="py-16 px-6 max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="rounded-3xl border border-slate-200 bg-white p-12 md:p-16 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center gap-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B88644]/10 rounded-full border border-[#B88644]/20">
                        <Sparkles className="w-3.5 h-3.5 text-[#B88644]" />
                        <span className="text-xs font-semibold text-[#B88644] tracking-wide uppercase">
                            {t('forum_coming_soon_badge')}
                        </span>
                    </div>

                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center ring-1 ring-slate-200">
                        <MessageSquare className="w-9 h-9 text-[#B88644]" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        {t('forum_coming_soon_title')}
                    </h1>

                    <p className="text-slate-500 max-w-xl leading-relaxed text-sm md:text-base">
                        {t('forum_coming_soon_text')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ForumView;
