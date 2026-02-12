import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const CopyButton = ({ content }) => {
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 mt-4 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-[#B88644] rounded-lg hover:bg-slate-50 transition-all"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('copy_button_done')}</span>
                </>
            ) : (
                <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('copy_button')}</span>
                </>
            )}
        </button>
    );
};

export default CopyButton;
