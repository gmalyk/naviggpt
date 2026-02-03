import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownContent = ({ content, className = "" }) => {
    return (
        <div className={`prose prose-lg prose-slate max-w-none prose-headings:text-slate-800 prose-h3:text-lg prose-h3:font-bold prose-p:leading-relaxed prose-strong:text-[#B88644] prose-a:text-[#B88644] prose-a:underline hover:prose-a:text-[#966E2E] ${className}`}>
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
