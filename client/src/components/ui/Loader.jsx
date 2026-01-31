import React from 'react';

const Loader = ({ className = "" }) => {
    return (
        <div className={`w-4 h-4 border-2 border-slate-100 rounded-full border-t-[#B88644] animate-spin ${className}`} />
    );
};

export default Loader;
