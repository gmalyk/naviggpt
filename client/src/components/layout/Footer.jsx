import React from 'react';

const partners = [
    { name: 'Gemini', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg' },
    { name: 'OpenAI', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
    { name: 'Claude', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Anthropic_logo.svg/1200px-Anthropic_logo.svg.png' },
    { name: 'Mistral', src: 'https://mistral.ai/images/logo_mistral_ai.png' }
];

const Footer = () => {
    return (
        <footer className="py-16 mt-auto">
            <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-8">Fonctionne avec</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-30 grayscale hover:opacity-50 transition-all duration-700 font-medium text-slate-400">
                    {partners.map(p => (
                        <div key={p.name} className="flex items-center gap-2">
                            <img
                                src={p.src}
                                alt={p.name}
                                className="h-4 object-contain"
                            />
                            <span className="text-xs font-semibold">{p.name === 'OpenAI' ? 'ChatGPT' : p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
