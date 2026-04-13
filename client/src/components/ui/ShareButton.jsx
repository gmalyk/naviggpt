import React, { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Share2, X, Download, ChevronLeft, ChevronRight, ImageDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const SLIDE_W = 1080;
const SLIDE_H = 1920;

const BG_IMAGES = [
    '/PXL_20260101_144021509.LONG_EXPOSURE-01.COVER.jpg',
    '/PXL_20260101_144159953.LONG_EXPOSURE-01.COVER.jpg',
    '/PXL_20260102_144849969.LONG_EXPOSURE-01.COVER.jpg',
];

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
        .replace(/\n{3,}/g, '\n\n')
        .trim();
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

function wrapTextCentered(ctx, text, centerX, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            ctx.fillText(line, centerX, currentY);
            currentY += lineHeight;
            line = word;
        } else {
            line = test;
        }
    }
    if (line) {
        ctx.fillText(line, centerX, currentY);
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

function cleanForShare(text) {
    return text
        .replace(/\bWant a quiz[^\n]*/gi, '')
        .replace(/\bSources?\b[:\s]*\n?((?:[-•*]\s*.*\n?)*)/gi, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\b(?:Bible Gateway|C\.S\.\s*Lewis|Wikipedia)[^\n]*/gi, '')
        .replace(/(?:Want to|Would you like to|I'd love to|Shall we)[^\n.?!]*\?/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function splitResponseIntoSlides(content, maxSlides = 4) {
    const plain = cleanForShare(stripMarkdown(content));
    if (plain.length < 100) return [plain];

    const paragraphs = plain.split(/\n\n+/)
        .map(p => p.replace(/\n/g, ' ').trim())
        .filter(p => p.length > 40 && /[.!?]/.test(p));

    const slides = paragraphs.slice(0, maxSlides);

    if (slides.length === 0) return [plain.replace(/\n/g, ' ').slice(0, 400)];

    // Truncate at the last complete sentence that fits
    return slides.map(s => {
        if (s.length <= 420) return s;
        const region = s.slice(0, 440);
        const sentenceEnd = /[.!?]/g;
        let lastEnd = -1;
        let m;
        while ((m = sentenceEnd.exec(region)) !== null) {
            if (m.index <= 400) lastEnd = m.index;
        }
        if (lastEnd > 60) return s.slice(0, lastEnd + 1).trim();
        const cut = s.slice(0, 400);
        const lastSpace = cut.lastIndexOf(' ');
        return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
    });
}

// Crop regions for 9:16 slides from landscape source images
function getCropRegions(imgW, imgH, count) {
    // We need 9:16 ratio crops from the source image
    const targetRatio = 9 / 16;
    let cropW, cropH;
    if (imgW / imgH > targetRatio) {
        // Image is wider — crop by height, narrow width
        cropH = imgH;
        cropW = imgH * targetRatio;
    } else {
        cropW = imgW;
        cropH = imgW / targetRatio;
    }
    const sy = Math.max(0, (imgH - cropH) / 2);
    const maxSx = imgW - cropW;
    const regions = [];
    for (let i = 0; i < count; i++) {
        const sx = count > 1 ? Math.min(maxSx, (maxSx / (count - 1)) * i) : maxSx / 2;
        regions.push({ sx, sy, w: cropW, h: cropH });
    }
    return regions;
}

function drawBackground(ctx, img, crop) {
    ctx.drawImage(img, crop.sx, crop.sy, crop.w, crop.h, 0, 0, SLIDE_W, SLIDE_H);
}

function drawOverlay(ctx, opacity = 0.48) {
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);
}

function drawGoldLine(ctx, y, width = 140) {
    const cx = SLIDE_W / 2;
    const grad = ctx.createLinearGradient(cx - width / 2, y, cx + width / 2, y);
    grad.addColorStop(0, 'rgba(184,134,68,0)');
    grad.addColorStop(0.2, '#D4A24C');
    grad.addColorStop(0.8, '#D4A24C');
    grad.addColorStop(1, 'rgba(184,134,68,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - width / 2, y);
    ctx.lineTo(cx + width / 2, y);
    ctx.stroke();
}

async function drawTitleSlide(ctx, img, crop, question, logoImg) {
    drawBackground(ctx, img, crop);
    drawOverlay(ctx, 0.55);

    const pad = 90;
    const logoSize = logoImg ? 110 : 0;
    const logoGap = logoImg ? 25 : 0;
    const brandFontSize = 46;
    const brandHeight = brandFontSize + 50;
    const goldLineGap = 90;

    // Measure question text height
    ctx.font = 'bold 62px Georgia, "Times New Roman", serif';
    const questionText = `"${question}"`;
    const maxWidth = SLIDE_W - pad * 2;
    const lineHeight = 82;
    const words = questionText.split(' ');
    let line = '';
    let questionLines = 0;
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            questionLines++;
            line = word;
        } else {
            line = test;
        }
    }
    if (line) questionLines++;
    const questionHeight = questionLines * lineHeight;

    const totalHeight = logoSize + logoGap + brandHeight + goldLineGap + questionHeight;
    let y = (SLIDE_H - totalHeight) / 2;

    if (logoImg) {
        ctx.drawImage(logoImg, (SLIDE_W - logoSize) / 2, y, logoSize, logoSize);
        y += logoSize + logoGap;
    }

    ctx.textAlign = 'center';
    ctx.font = `bold ${brandFontSize}px Georgia, "Times New Roman", serif`;
    ctx.fillStyle = '#D4A24C';
    ctx.fillText('Virggile', SLIDE_W / 2, y + brandFontSize);
    y += brandHeight;

    drawGoldLine(ctx, y);
    y += goldLineGap;

    ctx.font = 'bold 62px Georgia, "Times New Roman", serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    wrapTextCentered(ctx, questionText, SLIDE_W / 2, y, maxWidth, lineHeight);
}

function fitTextBySentences(ctx, text, maxWidth, lineHeight, maxY, startY) {
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [text];

    const measureHeight = (str) => {
        const words = str.trim().split(' ');
        let line = '';
        let y = startY;
        for (const word of words) {
            const test = line ? line + ' ' + word : word;
            if (ctx.measureText(test).width > maxWidth && line) {
                y += lineHeight;
                line = word;
            } else {
                line = test;
            }
        }
        if (line) y += lineHeight;
        return y;
    };

    let fitted = '';
    for (const sentence of sentences) {
        const candidate = (fitted + sentence).trim();
        if (measureHeight(candidate) > maxY && fitted) break;
        fitted = candidate;
    }

    return fitted.trim() || sentences[0].trim();
}

function drawContentSlide(ctx, img, crop, text, slideNum, totalSlides) {
    drawBackground(ctx, img, crop);
    drawOverlay(ctx, 0.50);

    const pad = 90;
    const fontSize = 44;
    const lineHeight = 64;

    // Vertically center the text block
    ctx.font = `${fontSize}px Georgia, "Times New Roman", serif`;
    const maxTextY = SLIDE_H - 140;
    const fittedText = fitTextBySentences(ctx, text, SLIDE_W - pad * 2, lineHeight, maxTextY, 0);

    // Measure fitted text height
    const words = fittedText.split(' ');
    let line = '';
    let textLines = 0;
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > SLIDE_W - pad * 2 && line) {
            textLines++;
            line = word;
        } else {
            line = test;
        }
    }
    if (line) textLines++;
    const textBlockHeight = textLines * lineHeight;

    // Gold line + gap + text block, all vertically centered
    const goldLineHeight = 60;
    const totalBlock = goldLineHeight + textBlockHeight;
    let y = (SLIDE_H - totalBlock) / 2;

    drawGoldLine(ctx, y, 70);
    y += goldLineHeight;

    ctx.textAlign = 'left';
    ctx.font = `${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.fillStyle = '#ffffff';
    wrapText(ctx, fittedText, pad, y, SLIDE_W - pad * 2, lineHeight);

    // Slide indicator bottom-right
    ctx.textAlign = 'right';
    ctx.font = '30px Georgia, "Times New Roman", serif';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(`${slideNum}/${totalSlides}`, SLIDE_W - pad, SLIDE_H - 70);
}

async function drawCtaSlide(ctx, img, crop, logoImg, ctaText) {
    drawBackground(ctx, img, crop);
    drawOverlay(ctx, 0.55);

    let y = SLIDE_H / 2 - 150;

    if (logoImg) {
        const logoSize = 140;
        ctx.drawImage(logoImg, (SLIDE_W - logoSize) / 2, y, logoSize, logoSize);
        y += logoSize + 35;
    }

    ctx.textAlign = 'center';
    ctx.font = 'bold 64px Georgia, "Times New Roman", serif';
    ctx.fillStyle = '#D4A24C';
    ctx.fillText('Virggile', SLIDE_W / 2, y);
    y += 60;

    drawGoldLine(ctx, y, 180);
    y += 60;

    ctx.font = '40px Georgia, "Times New Roman", serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(ctaText, SLIDE_W / 2, y);
    y += 60;

    ctx.font = '34px Georgia, "Times New Roman", serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('virggil.com', SLIDE_W / 2, y);
}

async function generateCarousel(question, content, t) {
    const bgSrc = BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)];
    const bgImg = await loadImage(bgSrc);

    let logoImg = null;
    try { logoImg = await loadImage('/logo.png'); } catch { /* ok */ }

    const contentSlides = splitResponseIntoSlides(content, 4);
    const totalSlides = contentSlides.length + 2; // title + content + cta
    const crops = getCropRegions(bgImg.naturalWidth, bgImg.naturalHeight, totalSlides);

    const slides = [];

    // Slide 1: Title
    const c1 = document.createElement('canvas');
    c1.width = SLIDE_W; c1.height = SLIDE_H;
    await drawTitleSlide(c1.getContext('2d'), bgImg, crops[0], question || '', logoImg);
    slides.push(c1);

    // Content slides
    for (let i = 0; i < contentSlides.length; i++) {
        const c = document.createElement('canvas');
        c.width = SLIDE_W; c.height = SLIDE_H;
        drawContentSlide(c.getContext('2d'), bgImg, crops[i + 1], contentSlides[i], i + 2, totalSlides);
        slides.push(c);
    }

    // CTA slide
    const cLast = document.createElement('canvas');
    cLast.width = SLIDE_W; cLast.height = SLIDE_H;
    await drawCtaSlide(cLast.getContext('2d'), bgImg, crops[totalSlides - 1], logoImg, t('share_card_cta'));
    slides.push(cLast);

    // Convert to JPEG blobs + dataUrls
    const results = await Promise.all(slides.map(async (canvas) => {
        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.92));
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        return { dataUrl, blob };
    }));

    return results;
}

/* ── Carousel Preview Modal ── */
const CarouselPreviewModal = ({ slides, onShare, onDownload, onClose, canNativeShare, t }) => {
    const scrollRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
        setCurrentSlide(idx);
    };

    const goTo = (idx) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={onClose}>
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-xs w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4 text-slate-500" />
                </button>

                {/* Carousel */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {slides.map((slide, i) => (
                            <div key={i} className="flex-shrink-0 w-full snap-center p-3 pb-0">
                                <img
                                    src={slide.dataUrl}
                                    alt={`Slide ${i + 1}`}
                                    className="w-full rounded-lg shadow-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Arrows */}
                    {currentSlide > 0 && (
                        <button
                            onClick={() => goTo(currentSlide - 1)}
                            className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hidden md:flex items-center justify-center"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                        </button>
                    )}
                    {currentSlide < slides.length - 1 && (
                        <button
                            onClick={() => goTo(currentSlide + 1)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hidden md:flex items-center justify-center"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                        </button>
                    )}
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-1.5 py-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentSlide ? 'bg-[#B88644]' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>

                {/* Actions */}
                <div className="p-3 pt-1 flex flex-col gap-2">
                    <button
                        onClick={onDownload}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#B88644] hover:bg-[#a07538] rounded-xl transition-colors"
                    >
                        <ImageDown className="w-4 h-4" />
                        Save All Images
                    </button>
                    {canNativeShare && (
                        <button
                            onClick={onShare}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            Share via other apps
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── ShareButton ── */
const ShareButton = ({ content, question }) => {
    const [slides, setSlides] = useState(null);
    const { t } = useTranslation();

    const openPreview = useCallback(async () => {
        const result = await generateCarousel(
            question || '',
            content || '',
            t
        );
        setSlides(result);
    }, [question, content, t]);

    const closePreview = () => setSlides(null);

    const canNativeShare = typeof navigator !== 'undefined' && !!navigator.canShare;

    const handleNativeShare = async () => {
        if (!slides) return;
        const files = slides.map((s, i) =>
            new File([s.blob], `virggil-${i + 1}.jpg`, { type: 'image/jpeg' })
        );
        const shareData = { files, text: 'virggil.com' };
        if (navigator.canShare?.(shareData)) {
            try { await navigator.share(shareData); } catch { /* cancelled */ }
        }
        closePreview();
    };

    const handleDownload = () => {
        if (!slides) return;
        slides.forEach((s, i) => {
            setTimeout(() => {
                const url = URL.createObjectURL(s.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `virggil-carousel-${i + 1}.jpg`;
                a.click();
                URL.revokeObjectURL(url);
            }, i * 200);
        });
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

            {slides && createPortal(
                <CarouselPreviewModal
                    slides={slides}
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
