import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAppState } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { navigateTo } from '../../hooks/useRouting';
import Logo from './Logo';

const SubscriptionModal = ({ isOpen, onClose, feature = 'followup' }) => {
    const { dispatch } = useAppState();
    const { t } = useTranslation();

    if (!isOpen) return null;

    const bodyKey = feature === 'companion'
        ? 'subscription_modal_companion_body'
        : 'subscription_modal_followup_body';

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={onClose}>
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4 text-slate-500" />
                </button>

                <Logo className="w-14 h-14 mx-auto mb-4 opacity-80" />

                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {t('subscription_modal_title')}
                </h3>

                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    {t(bodyKey)}
                </p>

                <button
                    onClick={() => {
                        onClose();
                        navigateTo(dispatch, 'pricing');
                    }}
                    className="w-full px-5 py-3 bg-[#B88644] hover:bg-[#a07538] text-white text-sm font-semibold rounded-full transition-colors"
                >
                    {t('subscription_modal_cta')}
                </button>
            </div>
        </div>,
        document.body
    );
};

export default SubscriptionModal;
