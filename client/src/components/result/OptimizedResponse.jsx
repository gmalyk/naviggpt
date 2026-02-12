import React from 'react';
import Logo from '../ui/Logo';
import MarkdownContent from '../ui/MarkdownContent';
import CopyButton from '../ui/CopyButton';

const OptimizedResponse = ({ content, innerRef }) => {
    return (
        <section ref={innerRef} className="scroll-mt-20 width-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2.5 mb-5">
                <Logo className="w-6 h-6" />
                <span className="text-sm font-semibold text-slate-700">Virgile</span>
            </div>
            <MarkdownContent content={content} />
            <CopyButton content={content} />
        </section>
    );
};

export default OptimizedResponse;
