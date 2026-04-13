import React from 'react';

const LogoSpinner = ({ className = "w-8 h-8" }) => {
    return (
        <svg viewBox="0 0 100 100" className={`${className} brand-protect`} style={{ colorScheme: 'light only' }} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="spin-copper" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8AA0B8" />
                    <stop offset="100%" stopColor="#6B879D" />
                </linearGradient>
                <linearGradient id="spin-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9BB0C4" />
                    <stop offset="100%" stopColor="#7A95A9" />
                </linearGradient>
                <linearGradient id="spin-brass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6E8496" />
                    <stop offset="100%" stopColor="#4F6577" />
                </linearGradient>
                <linearGradient id="spin-bronze" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7B8FA3" />
                    <stop offset="100%" stopColor="#4A5E72" />
                </linearGradient>
            </defs>

            {/* Static outer circle ring */}
            <circle cx="50" cy="50" r="44" stroke="#7B8FA3" strokeWidth="3" opacity="0.2" />

            {/* Spinning cross / 4 arcs */}
            <g style={{ transformOrigin: '50px 50px', animation: 'logo-spin 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite' }}>
                <path d="M47,10 A40,40 0 0,0 10,47" stroke="url(#spin-copper)" strokeWidth="12" strokeLinecap="butt" />
                <path d="M53,10 A40,40 0 0,1 90,47" stroke="url(#spin-gold)" strokeWidth="12" strokeLinecap="butt" />
                <path d="M90,53 A40,40 0 0,1 53,90" stroke="url(#spin-brass)" strokeWidth="12" strokeLinecap="butt" />
                <path d="M10,53 A40,40 0 0,0 47,90" stroke="url(#spin-bronze)" strokeWidth="12" strokeLinecap="butt" />
            </g>
        </svg>
    );
};

export default LogoSpinner;
