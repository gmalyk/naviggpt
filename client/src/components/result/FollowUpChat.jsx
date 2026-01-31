import React, { useState } from 'react';
import { Send, User } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useAI } from '../../hooks/useAI';
import MarkdownContent from '../ui/MarkdownContent';
import Loader from '../ui/Loader';

const FollowUpChat = () => {
    const { state } = useAppState();
    const { handleFollowUp, loading } = useAI();
    const [inputValue, setInputValue] = useState('');

    const onSend = async () => {
        if (!inputValue.trim() || loading) return;
        const text = inputValue.trim();
        setInputValue('');
        await handleFollowUp(text);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <section className="width-full mt-16 max-w-4xl mx-auto pb-12 animate-in fade-in duration-700 delay-500">
            <div className="space-y-8 mb-12">
                {state.followUpHistory.map((chat, idx) => (
                    <div key={idx} className="space-y-6 pt-8 border-t border-slate-100 animate-in fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Vous : {chat.user}</p>
                        </div>
                        <MarkdownContent content={chat.ai} />
                    </div>
                ))}
            </div>

            <div className="relative">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Une précision ? Une autre question ?"
                    className="w-full h-20 p-5 pr-16 bg-[#f0f4f9] border border-slate-100 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-[#B88644]/10 focus:border-[#B88644] transition-all text-sm placeholder:text-slate-400 resize-none shadow-sm"
                />
                <button
                    onClick={onSend}
                    disabled={loading || !inputValue.trim()}
                    className="absolute right-4 bottom-4 p-2.5 bg-white text-[#B88644] rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-30 disabled:hover:shadow-md"
                >
                    {loading ? <Loader /> : <Send className="w-4 h-4 rtl:scale-x-[-1]" />}
                </button>
            </div>
        </section>
    );
};

export default FollowUpChat;
