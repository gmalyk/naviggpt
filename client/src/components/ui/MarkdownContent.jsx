import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownContent = ({ content, className = "" }) => {
    return (
        <div className={`prose prose-slate max-w-none prose-h3:text-lg prose-h3:font-bold prose-p:leading-relaxed prose-strong:text-[#B88644] ${className}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownContent;
