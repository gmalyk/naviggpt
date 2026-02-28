import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownContent = ({ content, className = "" }) => {
    return (
        <div className={`prose prose-base max-w-none font-serif text-slate-600 prose-headings:text-slate-600 prose-headings:mt-5 prose-headings:mb-2 prose-h3:text-lg prose-h3:font-bold prose-p:my-2 prose-p:leading-relaxed prose-strong:text-slate-600 prose-a:text-slate-600 prose-a:underline hover:prose-a:text-slate-700 ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownContent;
