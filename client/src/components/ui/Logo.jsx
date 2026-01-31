import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
    return (
        <svg viewBox="0 0 100 100" className={`${className} transition-transform hover:scale-105`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="metal-copper" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D49078" />
                    <stop offset="100%" stopColor="#B36D56" />
                </linearGradient>
                <linearGradient id="metal-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E6C15A" />
                    <stop offset="100%" stopColor="#C49A3D" />
                </linearGradient>
                <linearGradient id="metal-brass" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A39656" />
                    <stop offset="100%" stopColor="#82773F" />
                </linearGradient>
                <linearGradient id="metal-bronze" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B88644" />
                    <stop offset="100%" stopColor="#8C622D" />
                </linearGradient>
            </defs>
            <path d="M47,10 A40,40 0 0,0 10,47" stroke="url(#metal-copper)" strokeWidth="12" strokeLinecap="butt" />
            <path d="M53,10 A40,40 0 0,1 90,47" stroke="url(#metal-gold)" strokeWidth="12" strokeLinecap="butt" />
            <path d="M90,53 A40,40 0 0,1 53,90" stroke="url(#metal-brass)" strokeWidth="12" strokeLinecap="butt" />
            <path d="M10,53 A40,40 0 0,0 47,90" stroke="url(#metal-bronze)" strokeWidth="12" strokeLinecap="butt" />
        </svg>
    );
};

export default Logo;
