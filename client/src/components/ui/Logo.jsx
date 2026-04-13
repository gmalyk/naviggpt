import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
    return (
        <svg viewBox="0 0 100 100" className={`${className} transition-transform hover:scale-105 brand-protect`} style={{ colorScheme: 'light only' }} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="metal-steel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8AA0B8" />
                    <stop offset="100%" stopColor="#6B8399" />
                </linearGradient>
                <linearGradient id="metal-platinum" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9BB0C4" />
                    <stop offset="100%" stopColor="#7C97AB" />
                </linearGradient>
                <linearGradient id="metal-pewter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6E8496" />
                    <stop offset="100%" stopColor="#556A7B" />
                </linearGradient>
                <linearGradient id="metal-silver" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7B8FA3" />
                    <stop offset="100%" stopColor="#4A5E72" />
                </linearGradient>
            </defs>
            <path d="M47,10 A40,40 0 0,0 10,47" stroke="url(#metal-steel)" strokeWidth="12" strokeLinecap="butt" />
            <path d="M53,10 A40,40 0 0,1 90,47" stroke="url(#metal-platinum)" strokeWidth="12" strokeLinecap="butt" />
            <path d="M90,53 A40,40 0 0,1 53,90" stroke="url(#metal-pewter)" strokeWidth="12" strokeLinecap="butt" />
            <path d="M10,53 A40,40 0 0,0 47,90" stroke="url(#metal-silver)" strokeWidth="12" strokeLinecap="butt" />
        </svg>
    );
};

export default Logo;
