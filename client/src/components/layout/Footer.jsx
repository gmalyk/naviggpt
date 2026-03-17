import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppState } from '../../context/AppContext';
import { navigateTo } from '../../hooks/useRouting';

const Footer = () => {
    const { t } = useTranslation();
    const { dispatch } = useAppState();

    const footerLinks = [
        { view: 'pricing', href: '/pricing', label: t('menu_pricing') },
        { view: 'about', href: '/about', label: t('menu_about') },
        { view: 'contact', href: '/contact', label: t('menu_contact') },
        { view: 'forum', href: '/forum', label: t('menu_forum') },
        { view: 'compass', href: '/compass', label: t('menu_compass') },
        { view: 'terms', href: '/terms', label: t('menu_terms') },
        { view: 'privacy', href: '/privacy', label: t('menu_privacy') },
    ];

    return (
        <footer className="py-16 mt-auto">
            <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
                <a
                    href="https://x.com/virggilAI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-slate-500 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {footerLinks.map(({ view, href, label }) => (
                        <a
                            key={view}
                            href={href}
                            onClick={(e) => { e.preventDefault(); navigateTo(dispatch, view); }}
                            className="text-[10px] text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
