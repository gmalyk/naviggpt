import React, { useState } from 'react';
import { Send, Mail, User, MessageSquare } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const ContactView = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error();
            setStatus('sent');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <section className="py-12 px-6 max-w-2xl mx-auto w-full flex flex-col items-center animate-in fade-in duration-500">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 mb-4">
                <Mail className="w-7 h-7 text-[#B88644]" />
            </div>

            <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-600 mb-2">
                    {t('contact_title')}
                </h1>
                <p className="text-slate-500 text-sm">
                    {t('contact_subtitle')}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5 w-full"
            >
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t('contact_name')}
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder={t('contact_name_placeholder')}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B88644]/30 focus:border-[#B88644] transition-colors"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t('contact_email')}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder={t('contact_email_placeholder')}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B88644]/30 focus:border-[#B88644] transition-colors"
                        />
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t('contact_subject')}
                    </label>
                    <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            name="subject"
                            required
                            value={form.subject}
                            onChange={handleChange}
                            placeholder={t('contact_subject_placeholder')}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B88644]/30 focus:border-[#B88644] transition-colors"
                        />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t('contact_message')}
                    </label>
                    <textarea
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder={t('contact_message_placeholder')}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B88644]/30 focus:border-[#B88644] transition-colors resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#B88644] hover:bg-[#a6763b] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <Send className="w-4 h-4" />
                    {status === 'sending' ? t('contact_sending') : t('contact_send')}
                </button>

                {/* Status messages */}
                {status === 'sent' && (
                    <p className="text-center text-sm text-green-600 font-medium">
                        {t('contact_success')}
                    </p>
                )}
                {status === 'error' && (
                    <p className="text-center text-sm text-red-500 font-medium">
                        {t('contact_error')}
                    </p>
                )}
            </form>
        </section>
    );
};

export default ContactView;
