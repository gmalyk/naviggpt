import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Share2, X, Download } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const CARD_W = 1080;
const CARD_H = 1920;

function stripMarkdown(text) {
    return text
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\n{2,}/g, '\n')
        .trim();
}

function summarize(markdown, maxLen = 280) {
    const plain = stripMarkdown(markdown);
    if (plain.length <= maxLen) return plain;
    const cut = plain.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            ctx.fillText(line, x, currentY);
            currentY += lineHeight;
            line = word;
        } else {
            line = test;
        }
    }
    if (line) {
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
    }
    return currentY;
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function generateCard(question, content, standardContent, labels, ctaText) {
    const canvas = document.createElement('canvas');
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    const pad = 90;
    let y = 120;

    // Logo from actual PNG
    try {
        const logoImg = await loadImage('/logo.png');
        const logoSize = 130;
        ctx.drawImage(logoImg, (CARD_W - logoSize) / 2, y, logoSize, logoSize);
        y += logoSize + 25;
    } catch {
        y += 25;
    }

    // Brand name
    ctx.textAlign = 'center';
    ctx.font = 'bold 46px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#B88644';
    ctx.fillText('Virggile', CARD_W / 2, y);
    y += 60;

    // Gold divider
    const drawDivider = (atY) => {
        const divGrad = ctx.createLinearGradient(pad * 2, atY, CARD_W - pad * 2, atY);
        divGrad.addColorStop(0, 'rgba(184,134,68,0)');
        divGrad.addColorStop(0.2, '#B88644');
        divGrad.addColorStop(0.8, '#B88644');
        divGrad.addColorStop(1, 'rgba(184,134,68,0)');
        ctx.strokeStyle = divGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pad * 2, atY);
        ctx.lineTo(CARD_W - pad * 2, atY);
        ctx.stroke();
    };

    drawDivider(y);
    y += 65;

    // Question text — slate-800
    ctx.textAlign = 'left';
    ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#1e293b';
    y = wrapText(ctx, question, pad, y, CARD_W - pad * 2, 58);
    y += 55;

    // Virggile answer label — gold
    ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#B88644';
    ctx.fillText(labels.virggile, pad, y);
    y += 50;

    // Virggile summary — slate-600
    const virggileSummary = summarize(content, 220);
    ctx.font = '33px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#475569';
    y = wrapText(ctx, virggileSummary, pad, y, CARD_W - pad * 2, 46);

    // Standard AI comparison (if available)
    if (standardContent) {
        y += 45;

        // Thin slate divider
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, y);
        ctx.lineTo(CARD_W - pad, y);
        ctx.stroke();
        y += 45;

        // Comparison label — slate-400
        ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(labels.standard, pad, y);
        y += 45;

        // Standard summary — slate-400, lighter
        const standardSummary = summarize(standardContent, 200);
        ctx.font = '30px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#94a3b8';
        y = wrapText(ctx, standardSummary, pad, y, CARD_W - pad * 2, 42);
    }

    // Bottom CTA
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#B88644';
    ctx.fillText(ctaText, CARD_W / 2, CARD_H - 120);
    ctx.font = '30px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('virggil.com', CARD_W / 2, CARD_H - 70);

    return canvas;
}

/* ── Preview Modal ── */
const PreviewModal = ({ dataUrl, onShare, onDownload, onClose, canNativeShare, t }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={onClose}>
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4 text-slate-500" />
                </button>

                {/* Card preview */}
                <div className="p-4 pb-0">
                    <img
                        src={dataUrl}
                        alt="Share card preview"
                        className="w-full rounded-xl border border-slate-100 shadow-sm"
                    />
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-3">
                    <button
                        onClick={onDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        {t('share_download')}
                    </button>
                    {canNativeShare && (
                        <button
                            onClick={onShare}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#B88644] hover:bg-[#a07538] rounded-xl transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            {t('share_button')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── ShareButton ── */
const ShareButton = ({ content, question, standardResponse }) => {
    const [preview, setPreview] = useState(null); // { dataUrl, blob }
    const { t } = useTranslation();

    const openPreview = useCallback(async () => {
        const canvas = await generateCard(
            question || '',
            content || '',
            standardResponse || '',
            {
                virggile: t('share_card_answer_label'),
                standard: t('share_card_comparison_label'),
            },
            t('share_card_cta')
        );
        const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
        const dataUrl = canvas.toDataURL('image/png');
        setPreview({ dataUrl, blob });
    }, [question, content, t]);

    const closePreview = () => setPreview(null);

    const canNativeShare = typeof navigator !== 'undefined' && !!navigator.canShare;

    const handleNativeShare = async () => {
        if (!preview) return;
        const file = new File([preview.blob], 'virggile-response.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({ files: [file] });
            } catch { /* cancelled */ }
        }
        closePreview();
    };

    const handleDownload = () => {
        if (!preview) return;
        const url = URL.createObjectURL(preview.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'virggile-response.png';
        a.click();
        URL.revokeObjectURL(url);
        closePreview();
    };

    return (
        <>
            <button
                onClick={openPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-[#B88644] rounded-lg hover:bg-slate-50 transition-all brand-protect"
            >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('share_button')}</span>
            </button>

            {preview && createPortal(
                <PreviewModal
                    dataUrl={preview.dataUrl}
                    onShare={handleNativeShare}
                    onDownload={handleDownload}
                    onClose={closePreview}
                    canNativeShare={canNativeShare}
                    t={t}
                />,
                document.body
            )}
        </>
    );
};

export default ShareButton;
