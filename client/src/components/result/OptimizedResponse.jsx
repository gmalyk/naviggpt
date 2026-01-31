import React from 'react';
import { Quote } from 'lucide-react';
import MarkdownContent from '../ui/MarkdownContent';

const OptimizedResponse = ({ content }) => {
    return (
        <section className="width-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 rounded-xl">
                    <Quote className="w-5 h-5 text-[#B88644] fill-[#B88644]/10" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#B88644] to-[#E6C15A] bg-clip-text text-transparent">
                    La réponse de Virgile
                </h2>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#B88644]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#B88644]/10 transition-all duration-1000" />
                <MarkdownContent content={content} />
            </div>
        </section>
    );
};

export default OptimizedResponse;
